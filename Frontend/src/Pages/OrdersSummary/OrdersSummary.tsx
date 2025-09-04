import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import styles from "./OrdersSummary.module.css";
import { Link } from "react-router-dom";
import { AddressFormData } from "../../types/Address";

// קומפוננטה של סיכום הזמנה
const OrderSummary = () => {
  // משיכת נתונים מהחנות וחישוב מחיר סופי
  const savedAddress = localStorage.getItem("currentAddress");
  const address: AddressFormData | null = savedAddress
    ? JSON.parse(savedAddress)
    : null;

  const userCart = useSelector((state: RootState) => state.cart.userCart);
  const totalItems = userCart.reduce((sum, item) => sum + item.amount, 0);
  const totalPrice = userCart.reduce(
    (sum, item) => sum + item.amount * item.price,
    0
  );

  return (
    <div className={styles.cartWrapper}>
      <h2 className={styles.title}>סיכום הזמנה</h2>
      <div className={styles.cartContent}>
        <div className={styles.itemsSection}>
          <div className={styles.addressContainer}>
            <h2 className={styles.header}>כתובת למשלוח</h2>
            <hr />
            <p>
              {address?.city}, {address?.street}, {address?.houseNumber},{" "}
              {address?.zip}
            </p>
          </div>

          <h2 className={styles.header}>פריטים בהזמנה</h2>
          <hr />
          {userCart.map((item, index) => (
            <div key={item._id || index} className={styles.itemCard}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className={styles.itemImage}
              />
              <div></div>
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
              </div>

              <div>
                <span className={styles.itemTotal}>{item.price}</span>
              </div>
              <div>
                <span className={styles.itemTotal}>{item.amount}x</span>
              </div>

              <div className={styles.itemTotal}>
                ₪{item.price * item.amount}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.summarySection}>
          <h3>סיכום לתשלום</h3>
          <div className={styles.summaryLine}>
            <span>סה"כ פריטים:</span>
            <span>{totalItems}</span>
          </div>
          <div className={styles.summaryLine}>
            <span className={styles.finalPrice}>מחיר סופי:</span>
            <span className={styles.totalPrice}>₪{totalPrice}</span>
          </div>
          <Link to="/payment">
            <button className={styles.checkoutBtn}>המשך לתשלום</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
