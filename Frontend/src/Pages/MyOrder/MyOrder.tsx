import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { getOrderApi, OrderUpdateDelivered } from "../../api/order";
import { OrderItem } from "../../types/Order";
import { toast } from "react-toastify";
import { handleAxiosError } from "../../utils/errorHandler";
import { AddressFormData } from "../../types/Address";
import styles from "./MyOrder.module.css";

const MyOrder = () => {
  const { id } = useParams();
  const [items, setItems] = useState<OrderItem[]>([]);
  const user = useSelector((state: RootState) => state.user.user);
  const [statusDelivery, setStatusDelivery] = useState(false);
  const [address, setAddress] = useState<AddressFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const newData = new Date();
  const formattedDate = newData.toLocaleDateString("he-IL");
  const totalPrice = items.reduce(
    (sum, item) => sum + item.amount * item.price,
    0
  );

  const handleSubmit = async () => {
    if (!id) return;
    try {
      setShowConfirm(false);
      setLoading(true);
      const res = await OrderUpdateDelivered(id);
      toast.success(res.data.message);
      setStatusDelivery(true);
    } catch (error) {
      handleAxiosError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const res = await getOrderApi(id);
        setItems(res.data.items);
        setStatusDelivery(res.data.isDelivered);
        setAddress(res.data.address);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingPage(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (loadingPage) {
    return (
      <div className={styles.cartWrapper}>
        <h2 className={styles.title}>טוען הזמנה...</h2>
      </div>
    );
  }

  return (
    <div className={styles.cartWrapper}>
      <h2 className={styles.title}>הזמנה מספר: {id}</h2>
      <div className={styles.cartContent}>
        <div className={styles.itemsSection}>
          <div className={styles.addressContainer}>
            <h2 className={styles.header}>פרטי משלוח</h2>
            <hr />
            <p>שם: {user?.userName}</p>
            <p>איימל: {user?.email}</p>
            <p>
              כתובת: {address?.city}, {address?.street} {address?.houseNumber},{" "}
              {address?.zip}
            </p>
          </div>

          <div
            className={styles.status}
            style={{
              backgroundColor: statusDelivery
                ? "hsla(135, 51%, 65%, 1.00)"
                : "#ffe6e6",
              color: statusDelivery ? "#195a03ff" : "#d9534f",
            }}
          >
            {statusDelivery ? `ההזמנה נמסרה ב- ${formattedDate}` : "טרם נמסר"}
          </div>

          <h2 className={styles.header}>פריטים בהזמנה</h2>
          <hr />
          {items.map((item) => (
            <div key={item.productId} className={styles.itemCard}>
              <img
                src={item.imageUrl}
                alt={item.name}
                className={styles.itemImage}
              />
              <div className={styles.itemInfo}>
                <span className={styles.itemName}>{item.name}</span>
              </div>
              <div className={styles.itemTotal}>₪{item.price}</div>
              <div className={styles.itemTotal}>{item.amount}x</div>
              <div className={styles.itemTotal}>
                ₪{item.price * item.amount}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summarySection}>
          <h3 className={styles.headerSummarty}>סיכום הזמנה</h3>
          <div className={styles.summaryLine}>
            <span className={styles.finalPrice}>מחיר פרטים:</span>
            <span className={styles.totalPrice}>₪{totalPrice}</span>
          </div>
          <hr />
          <h3 className={styles.total}>סה"כ לתשלום : ₪{totalPrice}</h3>

          {!statusDelivery && (
            <button
              onClick={() => setShowConfirm(true)}
              className={
                loading ? styles.checkoutBtnLoading : styles.checkoutBtn
              }
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>טוען...</span>
                  <span className={styles.loadingSpinner}></span>
                </>
              ) : (
                "אישור קבלה, קיבלתי את ההזמנה"
              )}
            </button>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className={styles.popoutBackdrop}>
          <div className={styles.popout}>
            <h3>האם אתה בטוח שברצונך לאשר את הקבלה?</h3>
            <div className={styles.popoutActions}>
              <button
                className={styles.confirmBtn}
                onClick={handleSubmit}
                disabled={loading}
              >
                כן
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                לא
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
