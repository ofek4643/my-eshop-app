import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import { toast } from "react-toastify";
import { resetPasswordApi } from "../../api/auth";
import { handleAxiosError } from "../../utils/errorHandler";
import { useNavigate } from "react-router-dom";

// קומפוננטה להחלפת הסיסמא 
function ResetPassword() {
  // מחלץ אץ הטוקן מהקישור על מנת שרק המשתמש רשאי לשנות את הסיסמא שלו
  const { token } = useParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const navigate = useNavigate();

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmited(true);
    let errors = false;

    // בדיקה ראשונית של השדות
    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      setNewPasswordError(true);
      errors = true;
    }

    if (confirmNewPassword !== newPassword) {
      setConfirmNewPasswordError(true);
      errors = true;
    }
    // הודעת שגיאה במידה ויש שגיאה
    if (errors) {
      toast.error("יש למלא את כל השדות בצורה תקינה");
      return;
    }

    // אם הכל תקין משנים את הסיסמא 
    try {
      setLoading(true);
      if (!token) {
        toast.error("קישור לא תקין");
        return;
      }
      const res = await resetPasswordApi({ newPassword, token });
      toast.success(res.data.message);
      navigate("/login");
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };
  // בדיקה בזמן אמת עם השדות תקינים
  useEffect(() => {
    if (submited) {
      if (
        newPassword.length < 8 ||
        !/[A-Z]/.test(newPassword) ||
        !/[0-9]/.test(newPassword)
      ) {
        setNewPasswordError(true);
      } else {
        setNewPasswordError(false);
      }
      if (confirmNewPassword !== newPassword) {
        setConfirmNewPasswordError(true);
      } else {
        setConfirmNewPasswordError(false);
      }
    }
  }, [submited, newPassword, confirmNewPassword]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>איפוס סיסמה</h1>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputWrapper}>
            <input
              type="password"
              placeholder="סיסמה חדשה"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.input}
              disabled={loading}
              required
            />
            {newPasswordError && (
              <div className={styles.errorText}>
                הסיסמה חייבת לכלול לפחות 8 תווים, אות גדולה ומספר
              </div>
            )}
          </div>

          <div className={styles.inputWrapper}>
            <input
              type="password"
              placeholder="אימות סיסמה"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className={styles.input}
              disabled={loading}
              required
            />
            {confirmNewPasswordError && (
              <div className={styles.errorText}>הסיסמאות לא תואמות</div>
            )}
          </div>
          <button
            type="submit"
            className={loading ? styles.buttonLoading : styles.button}
            disabled={loading}
          >
            {loading ? (
              <>
                <span>שומר...</span>
                <span className={styles.loadingSpinner}></span>
              </>
            ) : (
              "שמור סיסמה חדשה"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
