import { useState } from "react";
import styles from "./AddressDelivery.module.css";
import { toast } from "react-toastify";
import { AddressFormData } from "../../types/Address";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { addAddress } from "../../store/slices/addressSlice";
import { useNavigate } from "react-router-dom";

const AddressDelivery: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // שימוש ב-state כדי לעקוב אחרי הנתונים של הטופס
  const [formData, setFormData] = useState<AddressFormData>({
    city: "",
    street: "",
    houseNumber: "",
    zip: "",
  });

  // פונקציה לעדכון ה-state כאשר המשתמש מקליד בטופס
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // בדיקה בסיסית על המיקוד
    if (formData.zip.length !== 7) {
      return toast.error("מיקוד חייב להיות 7 ספרות");
    }
    // שומר את הכתובת בחנות
    localStorage.setItem("currentAddress", JSON.stringify(formData));
    dispatch(addAddress(formData));
    console.log("Form submitted:", formData);
    navigate("/orderSummary");
  };

  return (
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2 className={styles.title}>כתובת למשלוח</h2>

        <div className={styles.inputGroup}>
          <input
            type="text"
            name="city"
            placeholder="עיר"
            value={formData.city}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={`${styles.inputGroup} ${styles.row}`}>
          <input
            type="text"
            name="street"
            placeholder="רחוב"
            value={formData.street}
            onChange={handleChange}
            className={`${styles.input} ${styles.street}`}
            required
          />
          <input
            type="number"
            name="houseNumber"
            placeholder="מספר בית"
            value={formData.houseNumber}
            onChange={handleChange}
            className={`${styles.input} ${styles.houseNumber}`}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <input
            type="number"
            name="zip"
            placeholder="מיקוד"
            value={formData.zip}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          המשך
        </button>
      </form>
    </main>
  );
};

export default AddressDelivery;
