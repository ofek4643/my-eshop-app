import { useEffect, useState } from "react";
import styles from "./MyOrders.module.css";
import { Link } from "react-router-dom";
import { getAllOrderApi } from "../../api/order";
import { handleAxiosError } from "../../utils/errorHandler";
import { Order } from "../../types/Order";

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getAllOrderApi();
        setOrders(res.data);
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.btnContainer}>
        <Link to="/profile">
          <button className={styles.btn}>הפרטים שלי</button>
        </Link>
        <button className={`${styles.btn} ${styles.active}`}>
          ההזמנות שלי
        </button>
      </div>

      <h2 className={styles.title}>ההזמנות שלי</h2>

      {loading ? (
        <div className={styles.loadingContainer}>
          <span className={styles.loadingSpinner}></span>
          <span>טוען הזמנות...</span>
        </div>
      ) : orders.length === 0 ? (
        <p className={styles.noOrders}>אין הזמנות להצגה</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID הזמנה</th>
              <th>תאריך</th>
              <th>סכום כולל</th>
              <th>נמסר</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString("he-IL")}</td>
                <td>₪{order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isDelivered ? (
                    <span className={styles.check}>✔</span>
                  ) : (
                    <span className={styles.cross}>✘</span>
                  )}
                </td>
                <td>
                  <Link to={`/order/${order._id}`} className={styles.details}>
                    פרטים
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
