import React, { useEffect, useState } from "react";
import styles from "./Login.module.css";
import { FaEnvelope, FaKey, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { handleAxiosError } from "../../utils/errorHandler";
import { loginUser } from "../../api/auth";
import { useDispatch } from "react-redux";
import { getUserThunk } from "../../store/slices/userSlice";
import { AppDispatch, store } from "../../store/store";
import {
  fetchUserCartThunk,
  mergeGuestToUserCart,
  syncCartThunk,
} from "../../store/slices/cartSlice";

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmited(true);
    let errors = false;

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

    if (errors) {
      toast.error("יש למלא את כל השדות בצורה תקינה");
      return;
    }

    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      await dispatch(getUserThunk());
      const guestItems = store.getState().cart.items;
      if (guestItems.length > 0) {
        await dispatch(syncCartThunk(guestItems));
        await dispatch(fetchUserCartThunk());
        dispatch(mergeGuestToUserCart());
      }
      navigate("/");
      toast.success(res.data.message);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submited) {
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
  }, [submited, email, password]);

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>התחברות לחשבון</h2>
        <div className={styles.inputGroup}>
          <label className={styles.inputWrapper}>
            <FaEnvelope className={styles.icon} />
            <input
              type="email"
              placeholder="כתובת אימייל"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
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
              placeholder="סיסמא"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              autoComplete="current-password"
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
          className={loading ? styles.loginBtnLoading : styles.loginBtn}
          disabled={loading}
        >
          {loading ? (
            <>
              <span>מתחבר...</span>
              <span className={styles.loadingSpinner}></span>
            </>
          ) : (
            "התחברות"
          )}
        </button>
        <div className={styles.links}>
          אין לך חשבון?{" "}
          <Link to="/register" className={styles.link}>
            הירשם/י כאן
          </Link>
          <br />
          <br />
          <Link to="/forgot-password" className={styles.link}>
            שכחת סיסמה?
          </Link>
        </div>
      </form>
    </main>
  );
};

export default Login;
