import styles from "../Accessibility/Accessibility.module.css";
// קומפוננטה להצהרת נגישות
const Accessibility = () => {
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
            <h1 className={styles.title}>הצהרת נגישות</h1>
            <p className={styles.subTitle}>
              אנו רואים חשיבות רבה בהנגשת האתר לכלל הציבור, ובפרט לאנשים עם
              מוגבלויות. אתר החנות שלנו תוכנן והותאם לפי עקרונות תקנות שוויון
              זכויות לאנשים עם מוגבלות.
            </p>

            <h2 className={styles.secendHeader}>1. התאמות שבוצעו באתר</h2>
            <p>
              ✔ ניווט נוח באמצעות מקלדת ✔ התאמת צבעים וניגודיות ✔ טקסטים ברורים
              וגדולים לקריאה נוחה ✔ אפשרות לשימוש בקוראי מסך ✔ התאמת מבנה האתר
              לגלישה בסלולרי ובטאבלט
            </p>

            <h2 className={styles.secendHeader}>2. תמיכה בדפדפנים</h2>
            <p>
              האתר מותאם לדפדפנים נפוצים כגון: Chrome, Firefox, Edge, Safari.
              ייתכנו פערים בשימוש בגרסאות ישנות.
            </p>

            <h2 className={styles.secendHeader}>3. פניות בנושא נגישות</h2>
            <p>
              במידה ונתקלת בבעיה בנגישות באתר, נשמח שתעדכן אותנו. אנו מתחייבים
              לטפל בפנייה בהקדם האפשרי. ניתן לפנות אלינו בכתובת המייל:
              ofekeshop@gmail.com
            </p>

            <h2 className={styles.secendHeader}>4. המשך שיפור</h2>
            <p>
              אנו ממשיכים לפעול לשיפור הנגישות באתר, כחלק ממחויבותנו לספק חוויית
              שימוש שוויונית ונגישה לכלל המשתמשים.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
