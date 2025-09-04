import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import styles from "../Register/Register.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api/auth";
import { handleAxiosError } from "../../utils/errorHandler";
// קומפוננטה להרשמה
const Register: React.FC = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [usernameError, setUserNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [popout, setPopout] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmited(true);
    let errors = false;

    // בדיקה ראשונית של השדות
    if (userName.length < 8) {
      setUserNameError(true);
      errors = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.(com|co\.il)$/.test(email)) {
      setEmailError(true);
      errors = true;
    }
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      setPasswordError(true);
      errors = true;
    }
    // אם יש שגיאה
    if (errors) {
      toast.error("יש למלא את כל השדות בצורה תקינה");
      return;
    }

    // שולחים לצד שרת את הנתונים
    try {
      setLoading(true);
      const res = await registerUser({ userName, email, password });
      setPopout(true);
      toast.success(res.data.message);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };
  
  // בדיקה בזמן אמת של השדות
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
      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password)
      ) {
        setPasswordError(true);
      } else {
        setPasswordError(false);
      }
    }
  }, [submited, userName, email, password]);

  return (
    <main className={styles.main}>
      {popout && (
        <div className={styles.backdrop}>
          <div className={styles.popout}>
            <h2 className={styles.headerPopout}>ההרשמה כמעט הושלמה!</h2>
            <p className={styles.textPopout}>
              שלחנו מייל אימות לכתובת {email}. יש ללחוץ על הקישור במייל כדי
              להפעיל את החשבון.
            </p>
            <div className={styles.actions}>
              <button
                className={styles.delete}
                onClick={() => {
                  navigate("/login");
                }}
              >
                הבנתי, עבור להתחברות
              </button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>יצירת חשבון חדש</h2>

        <div className={styles.inputGroup}>
          <label className={styles.inputWrapper}>
            <FaUser className={styles.icon} />
            <input
              type="text"
              placeholder="שם משתמש"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className={styles.input}
              disabled={loading}
            />
          </label>
          <div className={styles.error}>
            {usernameError && (
              <div className={styles.errorText}>
                שם המשתמש חייב להיות לפחות 8 תווים
              </div>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputWrapper}>
            <FaEnvelope className={styles.icon} />
            <input
              type="email"
              placeholder="כתובת אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              autoComplete="email"
              disabled={loading}
            />
          </label>
          <div className={styles.error}>
            {emailError && (
              <div className={styles.errorText}>
                יש להזין כתובת אימייל חוקית (כולל .com או .co.il)
              </div>
            )}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputWrapper}>
            <FaKey className={styles.icon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className={styles.input}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeButton}
            >
              {showPassword ? (
                <FaEyeSlash className={styles.eyeIcon} />
              ) : (
                <FaEye className={styles.eyeIcon} />
              )}
            </button>
          </label>
          <div className={styles.error}>
            {passwordError && (
              <div className={styles.errorText}>
                הסיסמה חייבת לכלול לפחות 8 תווים, אות גדולה אחת ומספר אחד
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={loading ? styles.registerBtnLoading : styles.registerBtn}
          disabled={loading}
        >
          {loading ? (
            <>
              <span>נרשם...</span>
              <span className={styles.loadingSpinner}></span>
            </>
          ) : (
            "הרשמה"
          )}
        </button>

        <div className={styles.links}>
          כבר יש לך חשבון?{" "}
          <Link to="/login" className={styles.link}>
            התחבר/י כאן
          </Link>
        </div>
      </form>
    </main>
  );
};

export default Register;
