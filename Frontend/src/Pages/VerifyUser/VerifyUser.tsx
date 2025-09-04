import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./VerifyUser.module.css";
import { verifyUserApi } from "../../api/auth";

const VerifyUser = () => {
  const { userId, token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      try {
        if (!userId || !token) return;

        const res = await verifyUserApi(userId, token);
        setStatus("success");
        setMessage(res.data.message);
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.response?.data?.error || "קישור האימות לא חוקי או שפג תוקפו"
        );
      }
    };

    verify();
  }, [userId, token]);

  return (
    <div className={styles.container}>
      {status === "loading" && <p className={styles.loading}>טוען...</p>}

      {status === "success" && (
        <div className={styles.success}>
          <div className={styles.icon}>✔️</div>
          <p>{message}</p>
          <button className={styles.button} onClick={() => navigate("/login")}>
            עבור לדף ההתחברות
          </button>
        </div>
      )}

      {status === "error" && (
        <div className={styles.error}>
          <div className={styles.icon}>❌</div>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyUser;
