import styles from "./Footer.module.css";
import { Link } from "react-router-dom";
// קומפוננטה של כותרת תחתונה
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.containerAll}>
        <div className={styles.containerInfo}>
          <div className={styles.twoGap}>
            <h3 className={styles.headers}>E-Shop</h3>
            <p className={styles.text}>
              החנות הדיגיטלית המובילה למוצרים שאתם אוהבים. איכות, שירות ואמינות
              במקום אחד.
            </p>
            <ul className={styles.socialList}>
              <li>
                <Link target="_blank" to="https://www.facebook.com/" className={styles.white}>
                  <i className="fa-brands fa-facebook-f"></i>
                </Link>
              </li>
              <li>
                <Link target="_blank" to="https://www.instagram.com/" className={styles.white}>
                  <i className="fa-brands fa-instagram"></i>
                </Link>
              </li>
              <li>
                <Link target="_blank" to="https://x.com/" className={styles.white}>
                  <i className="fa-brands fa-twitter"></i>
                </Link>
              </li>
              <li>
                <Link target="_blank" to="https://www.linkedin.com/in/ofek-ddia-552757356/" className={styles.white}>
                  <i className="fa-brands fa-linkedin-in"></i>
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.oneGap}>
            <h3 className={styles.headers}>מפת אתר</h3>
            <ul>
              <li className={styles.listItem}>
                <Link className={styles.white} to="/">
                  דף הבית
                </Link>
              </li>
              <li className={styles.listItem}>
                <Link className={styles.white} to="/cart">
                  עגלת קניות
                </Link>
              </li>
              <li className={styles.listItem}>
                <Link className={styles.white} to="/profile">
                  הפרופיל שלי
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.oneGap}>
            <h3 className={styles.headers}>מידע ושירות</h3>
            <ul>
              <li className={styles.listItem}>
                <Link className={styles.white} to="/privacy">
                  מדיניות הפרטיות
                </Link>
              </li>
              <li className={styles.listItem}>
                <Link className={styles.white} to="/terms">
                  תקנון האתר
                </Link>
              </li>
              <li className={styles.listItem}>
                <Link className={styles.white} to="/accessibility">
                  הצהרת נגישות
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.twoGap}>
            <h3 className={styles.headers}>הישארו מעודכנים</h3>
            <p className={styles.text}>הירשמו לניוזלטר שלנו לקבלת עדכונים ומבצעים.</p>
              <input
                className={styles.inputField}
                type="email"
                placeholder="האימייל שלכם"
              />
              <button className={styles.sendBtn}>הרשם</button>
          </div>
        </div>

        <div className={styles.copyRight}>
          <span>E-Shop © 2025 כל הזכויות שמורות</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
