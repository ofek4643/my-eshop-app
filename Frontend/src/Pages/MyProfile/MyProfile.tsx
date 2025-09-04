import styles from "./MyProfile.module.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { deleteUserApi, updateUserApi } from "../../api/user";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleAxiosError } from "../../utils/errorHandler";
import { useDispatch } from "react-redux";
import { clearUser } from "../../store/slices/userSlice";

// קומפוננטה לפרופיל שלי
const MyProfile = () => {
  // שדות לטופס + טעינה + שגיאות
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [submited, setSubmited] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [usernameError, setUserNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false);
  const [popout, setPopout] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: RootState) => state.user);

  // לוקח מהחנות את פרטי המשתמש
  useEffect(() => {
    setUserName(user?.userName || "");
    setEmail(user?.email || "");
  }, [user]);

  //פונקציה למחיקת המשתמש
  const deleteUser = async () => {
    try {
      setLoadingDelete(true);
      const res = await deleteUserApi();
      toast.success(res.data.message);
      dispatch(clearUser());
      navigate("/");
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoadingDelete(false);
    }
  };

  // פונקציה לשינוי הפרופיל של המשתמש
  const changeProfileInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmited(true);
    let errors = false;
    
    //בדיקה ראשונית לאיתור שגיאות בשדות
    if (userName.length < 8) {
      setUserNameError(true);
      errors = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.(com|co\.il)$/.test(email)) {
      setEmailError(true);
      errors = true;
    }
    if (newPassword.length !== 0) {
      if (
        newPassword.length < 8 ||
        !/[A-Z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword)
      ) {
        setNewPasswordError(true);
        errors = true;
      }

      if (
        confirmNewPassword.length < 8 ||
        !/[A-Z]/.test(confirmNewPassword) ||
        !/[0-9]/.test(confirmNewPassword) ||
        confirmNewPassword !== newPassword
      ) {
        setConfirmNewPasswordError(true);
        errors = true;
      }
    }

    // הודעת שגיאה
    if (errors) {
      toast.error("יש למלא את כל השדות בצורה תקינה");
      return;
    }
    // הכל תקין אפשר לשלוח בקשה לשרת לשינוי פרטי המשתמש
    try {
      setLoadingUpdate(true);
      const res = await updateUserApi({
        userName,
        email,
        newPassword,
        confirmNewPassword,
      });
      toast.success(res.data.message);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoadingUpdate(false);
    }
  };

  // בדיקה בזמן אמת את השדות
  useEffect(() => {
    if (submited) {
      if (userName.length < 8) {
        setUserNameError(true);
      } else {
        setUserNameError(false);
      }
      if (!/^[^\s@]+@[^\s@]+\.(com|co\.il)$/.test(email)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
      if (newPassword.length !== 0) {
        if (
          newPassword.length < 8 ||
          !/[A-Z]/.test(newPassword) ||
          !/[0-9]/.test(newPassword)
        ) {
          setNewPasswordError(true);
        } else {
          setNewPasswordError(false);
        }
        if (
          confirmNewPassword.length < 8 ||
          !/[A-Z]/.test(confirmNewPassword) ||
          !/[0-9]/.test(confirmNewPassword) ||
          confirmNewPassword !== newPassword
        ) {
          setConfirmNewPasswordError(true);
        } else {
          setConfirmNewPasswordError(false);
        }
      } else {
        setNewPasswordError(false);
        setConfirmNewPasswordError(false);
      }
    }
  }, [submited, userName, email, newPassword, confirmNewPassword]);

  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <button className={`${styles.btn} ${styles.active}`}>הפרטים שלי</button>
        <Link to="/profile/my-orders">
          <button className={styles.btn}>ההזמנות שלי</button>
        </Link>
      </div>

      <div className={styles.profilecontainer}>
        <h2 className={styles.title}>הפרטים שלי</h2>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          <label className={styles.label}>שם משתמש</label>
          <input
            type="text"
            value={userName}
            placeholder="username"
            autoComplete="username"
            onChange={(e) => setUserName(e.target.value)}
            className={styles.input}
            disabled={loadingUpdate}
          />
          <div className={styles.error}>
            {usernameError && (
              <div className={styles.errorText}>
                שם המשתמש חייב להיות לפחות 8 תווים
              </div>
            )}
          </div>

          <label className={styles.label}>כתובת אימייל</label>
          <input
            type="email"
            value={email}
            placeholder="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            disabled={loadingUpdate}
          />
          <div className={styles.error}>
            {emailError && (
              <div className={styles.errorText}>
                יש להזין כתובת אימייל חוקית (כולל .com או .co.il)
              </div>
            )}
          </div>

          <label className={styles.label}>
            סיסמה חדשה (השאר ריק כדי לא לשנות)
          </label>
          <input
            type="password"
            placeholder="******"
            value={newPassword}
            autoComplete="new-password"
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            disabled={loadingUpdate}
          />
          <div className={styles.error}>
            {newPasswordError && (
              <div className={styles.errorText}>
                הסיסמה חייבת לכלול לפחות 8 תווים, אות גדולה אחת ומספר אחד
              </div>
            )}
          </div>

          <label className={styles.label}>אשר סיסמה חדשה</label>
          <input
            type="password"
            placeholder="******"
            autoComplete="new-password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className={styles.input}
            disabled={loadingUpdate}
          />
          <div className={styles.error}>
            {confirmNewPasswordError && (
              <div className={styles.errorText}>הסיסמאות לא תואמות</div>
            )}
          </div>

          <button
            onClick={changeProfileInfo}
            type="submit"
            className={
              loadingUpdate ? styles.updateBtnLoading : styles.updateBtn
            }
            disabled={loadingUpdate}
          >
            {loadingUpdate ? (
              <>
                <span>מעדכן...</span>
                <span className={styles.loadingSpinner}></span>
              </>
            ) : (
              "עדכן פרטים"
            )}
          </button>
        </form>

        <div className={styles.deleteSection}>
          <h3 className={styles.deleteTitle}>מחיקת חשבון</h3>
          <p className={styles.deleteText}>
            מחיקת החשבון היא פעולה סופית. לא ניתן למחוק חשבון אם קיימות הזמנות
            ששולמו.
          </p>
          <button onClick={() => setPopout(true)} className={styles.deleteBtn}>
            מחק את החשבון שלי
          </button>
        </div>
      </div>
      {popout && (
        <div className={styles.backdrop}>
          <div className={styles.popout}>
            <h2 className={styles.headerPopout}>מחיקת משתמש!</h2>
            <p className={styles.textPopout}>
              האם אתה בטוח שאתה רוצה למחוק את המשתמש פעולה זאת סופית
            </p>
            <div className={styles.actions}>
              <button className={styles.back} onClick={() => setPopout(false)}>
                התחרטתי
              </button>
              <button
                onClick={deleteUser}
                className={loadingDelete ? styles.deleteLoading : styles.delete}
                disabled={loadingDelete}
              >
                {loadingDelete ? (
                  <>
                    <span>מוחק...</span>
                    <span className={styles.loadingSpinner}></span>
                  </>
                ) : (
                  "מחק משתמש"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
