import styles from "./Cart.module.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import {
  removeFromCart,
  addOneItem,
  removeOneItem,
  // mergeGuestToUserCart,
  fetchUserCartThunk,
  addOneItemThunk,
  removeOneItemThunk,
  removeItemThunk,
} from "../../store/slices/cartSlice";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

const Cart = () => {
  // משיכה ושימוש בפועלות ונתונים בחנות
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const userCart = useSelector((state: RootState) => state.cart.userCart);
  const user = useSelector((state: RootState) => state.user.user);
  const cartToShow = user ? userCart : items;
  const [loading, setLoading] = useState(false);

  const totalItems = cartToShow.reduce((sum, item) => sum + item.amount, 0);
  const totalPrice = cartToShow.reduce(
    (sum, item) => sum + item.amount * item.price,
    0
  );

  // משיכת העגלה מפרטי המשתמש בחנות
  useEffect(() => {
    if (user) {
      dispatch(fetchUserCartThunk());
    }
  }, [user, dispatch]);

  if (cartToShow.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <p>🛒 העגלה שלך ריקה</p>
        <Link to="/" className={styles.returnLink}>
          חזרה לחנות
        </Link>
      </div>
    );
  }
  // הוספת מוצר אחד קיים בחנות
  const handleAddOne = async (itemId: string) => {
    if (user) {
      setLoading(true);
      await dispatch(addOneItemThunk(itemId));
      await dispatch(fetchUserCartThunk());
      setLoading(false);
    } else {
      dispatch(addOneItem(itemId));
    }
  };

  // הסרת מוצר אחד קיים בחנות
  const handleRemoveOne = async (itemId: string) => {
    if (user) {
      setLoading(true);
      await dispatch(removeOneItemThunk(itemId));
      await dispatch(fetchUserCartThunk());
      setLoading(false);
    } else {
      dispatch(removeOneItem(itemId));
    }
  };

  // הסרת מוצר בחנות
  const handleRemoveItem = async (itemId: string) => {
    if (user) {
      setLoading(true);
      await dispatch(removeItemThunk(itemId));
      await dispatch(fetchUserCartThunk());
      setLoading(false);
    } else {
      dispatch(removeFromCart(itemId));
    }
  };

  return (
    <div className={styles.cartWrapper}>
      <h2 className={styles.title}>עגלת קניות</h2>
      <div className={styles.cartContent}>
        <div className={styles.itemsSection}>
          {cartToShow.map((item, index) => (
            <div key={item._id || index} className={styles.itemCard}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className={styles.itemImage}
              />

              <div className={styles.itemInfo}>
                <Link to={`/product/${item._id}`} className={styles.itemName}>
                  {item.name}
                </Link>
                <p className={styles.price}>₪{item.price}</p>
              </div>

              <div className={styles.itemTotal}>
                ₪{item.price * item.amount}
              </div>

              <div className={styles.quantityControls}>
                <button
                  disabled={loading}
                  className={styles.minusBtn}
                  onClick={() => handleRemoveOne(item._id)}
                >
                  −
                </button>
                <span className={styles.amount}>{item.amount}</span>

                <button
                  disabled={item.amount >= item.stock || loading}
                  className={styles.plusBtn}
                  onClick={() => handleAddOne(item._id)}
                >
                  +
                </button>
                <button
                  disabled={loading}
                  className={styles.removeBtn}
                  onClick={() => handleRemoveItem(item._id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summarySection}>
          <h3>סיכום הזמנה</h3>
          <div className={styles.summaryLine}>
            <span>סה"כ פריטים:</span>
            <span>{totalItems}</span>
          </div>
          <div className={styles.summaryLine}>
            <span>מחיר כולל:</span>
            <span className={styles.totalPrice}>₪{totalPrice}</span>
          </div>
          <Link to={user ? "/addressDelivery" : "/login"}>
            <button className={styles.checkoutBtn}>המשך לתשלום</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
