import styles from "../Privacy/Privacy.module.css";
// קומפוננטה של פרטיות
const Privacy = () => {
  return (
    <div>
      <button
        onClick={() => {
          window.history.back();
        }}
        className={styles.backButton}
      >
        חזור
      </button>
      <div className={styles.warrper}>
        <div className={styles.card}>
          <div className={styles.page}>
            <h1 className={styles.title}>מדיניות פרטיות</h1>
            <p className={styles.subTitle}>
              אנו מחויבים לשמירה על פרטיות לקוחותינו באתר החנות הדיגיטלית
              ולשימוש אחראי במידע הנאסף.
            </p>

            <h2 className={styles.secendHeader}>1. מידע שנאסף</h2>
            <p>
              אנו אוספים מידע כגון פרטי יצירת קשר, פרטי תשלום, היסטוריית רכישות,
              ונתוני גלישה באתר, במטרה לספק שירות איכותי ובטוח ללקוחותינו.
            </p>

            <h2 className={styles.secendHeader}>2. שימוש במידע</h2>
            <p>
              המידע משמש לצורך עיבוד הזמנות, ניהול חשבונות, שיפור חוויית הקנייה,
              שליחת עדכונים על מוצרים ומבצעים, ומתן שירות לקוחות מיטבי.
            </p>

            <h2 className={styles.secendHeader}>3. שיתוף מידע</h2>
            <p>
              אנו לא נמכור או נחליף מידע אישי לצדדים שלישיים ללא הסכמתך, אלא אם
              הדבר נדרש על פי חוק או לצורך מתן השירות (כגון חברות סליקה, משלוחים
              או ספקי שירות טכניים).
            </p>

            <h2 className={styles.secendHeader}>4. אבטחת מידע</h2>
            <p>
              אנו משתמשים באמצעי אבטחה טכנולוגיים וארגוניים מתקדמים, על מנת להגן
              על המידע האישי שלך ולמנוע גישה בלתי מורשית.
            </p>

            <h2 className={styles.secendHeader}>5. זכויותיך</h2>
            <p>
              באפשרותך לבקש גישה, עדכון או מחיקה של המידע האישי שלך בהתאם לחוק
              הגנת הפרטיות.
            </p>

            <h2 className={styles.secendHeader}>6. יצירת קשר</h2>
            <p>
              לשאלות בנוגע לפרטיות ושימוש במידע, ניתן לפנות אלינו בכתובת:
              ofekeshop@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
