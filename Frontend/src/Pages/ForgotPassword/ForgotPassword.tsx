import React, { useEffect, useState } from "react";
import styles from "./ForgotPassword.module.css";
import { forgotPasswordApi } from "../../api/auth";
import { toast } from "react-toastify";
import { handleAxiosError } from "../../utils/errorHandler";

const ForgotPassword = () => {
  const [submited, setSubmited] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setSubmited(true);
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.(com|co\.il)$/.test(email)) {
      setEmailError(true);
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPasswordApi({ email });
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
    }
  }, [email, submited]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>איפוס סיסמה</h1>
        <p className={styles.subTitle}>
          הזן את כתובת המייל שלך ונשלח אליך קישור לאיפוס הסיסמה.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email" className={styles.label}>
            אימייל
          </label>
          <input
            type="email"
            id="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className={styles.error}>
            {emailError && (
              <div className={styles.errorText}>
                יש להזין כתובת אימייל חוקית (כולל .com או .co.il)
              </div>
            )}
          </div>

          <button
            type="submit"
            className={loading ? styles.buttonLoading : styles.button}
            disabled={loading}
          >
            {loading ? (
              <>
                <span>שולח...</span>
                <span className={styles.loadingSpinner}></span>
              </>
            ) : (
              "שלח קישור לאיפוס"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
