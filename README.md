# 🛒 E-Shop

E-Shop הוא פרויקט חנות אונליין שנבנה באמצעות **React + TS + Redux** בפרונטאנד ו־ **Node.js + Express + MongoDB** בבקאנד.  
המערכת מאפשרת למשתמשים להירשם, להתחבר, לצפות במוצרים, להוסיף לעגלת קניות, ולבצע ניהול בסיסי של חשבון אישי.

---

## 🚀 טכנולוגיות עיקריות

- **Frontend:** React, TypeScript, React Router, Redux Toolkit, Axios, CSS Modules
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB
- **Authentication:** JWT + Cookies + bcrypt (התחברות / הרשמה / שחזור סיסמה)
- **Authorization:** authMiddleware לאימות טוקנים, isAdmin להגבלת גישת מנהלים
- **Deployment:** Render

---

## 📂 מבנה הפרויקט

Eshop-project/
│── Backend/ # צד שרת
│ ├── config/ # קונפיגורציות (DB)
│ ├── controllers/ # לוגיקת בקשות (products, users, orders וכו')
│ ├── middleware/ # authMiddleware, isAdmin וכו'
│ ├── models/ # סכמות Mongoose
│ ├── routes/ # ניתוב API
│ ├── utils/ # פונקציות עזר
│ └── server.ts # קובץ הפעלת השרת
│
│── Frontend/
│ └── src/
│ ├── api/ # בקשות לשרת (axios')
│ ├── Components/ # קומפוננטות כלליות
│ ├── Pages/ # דפי האתר (Home, Login, ProductPage וכו')
│ ├── store/ # לניהול state
│ ├── types/ # TypeScript types
│ ├── utils/ # פונקציות עזר
│ ├── App.tsx # קומפוננטת השורש
│ └── main.tsx # נקודת כניסה לפרויקט
│
├── .env # משתני סביבה
├── package.json # סקריפטים ותלויות
├── tsconfig.json # הגדרות TypeScript
├── vite.config.ts # הגדרות Vite
└── README.md

---

## ⚙️ התקנה והרצה מקומית

1. שיבוט הפרויקט:

   ```bash
   git clone https://github.com/ofek4643/EShop-project-react.git
   cd EShop-project/my-eshop-app>
   npm install
   npm run dev
   ```

---

## 🌐 הגדרות לשרת

cd EShop-project/my-eshop-app>
npm run server

---

## 📊 פיצ'רים בפרויקט

- 🔐 **Authentication & Authorization** – הרשמה, התחברות, שכחתי סיסמה, הרשאות אדמין
- 🛒 **עגלת קניות** – הוספה, מחיקה וניהול מוצרים בעגלה
- 💳 **תשלום** – תהליך תשלום מלא דרך Payment API
- 📦 **ניהול הזמנות** – צפייה בהזמנות, כולל אישור קיבלתי את המשלוח"
- 👤 **פרופיל אישי** – עדכון פרטים אישיים, מחיקת משתמש

## 📊 ביצוע תשלום

🔹 כרטיס אשראי לדוגמה (PayPal Sandbox)

- card - 4580437009789805 תוקף - 06/2030 cvv-123

🔹 PayPal Sandbox

- paypal - email - sb-uafm742812816@personal.example.com - password - hIo'1?!(