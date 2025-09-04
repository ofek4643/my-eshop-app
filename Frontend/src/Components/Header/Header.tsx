import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { clearUser} from "../../store/slices/userSlice";
import { RootState, AppDispatch } from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUserPlus,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import { useEffect } from "react";
import { logoutUser } from "../../api/auth";
import { toast } from "react-toastify";
import { handleAxiosError } from "../../utils/errorHandler";
import {
  clearUserCart,
  fetchUserCartThunk,
} from "../../store/slices/cartSlice";

// קומפוננטה של כותרת עליונה
const Header: React.FC = () => {
  // שימוש בנתונים מהחנות
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const userCart = useSelector((state: RootState) => state.cart.userCart);

  const { user } = useSelector((state: RootState) => state.user);
  const totalItems = user
    ? userCart.reduce((sum, item) => sum + item.amount, 0)
    : items.reduce((sum, item) => sum + item.amount, 0);
  const navigate = useNavigate();

  // ברגע שטוענים את הדף את כמות המוצרים של המשתמש בעגלה על מנת להראות בheader

  useEffect(() => {
    if (user) {
      dispatch(fetchUserCartThunk());
    }
  }, [user, dispatch]);

  //פונקציה להתנתקות
  const logout = async () => {
    try {
      const res = await logoutUser();
      toast.success(res.data.message);
      dispatch(clearUser());
      dispatch(clearUserCart());
      navigate("/");
    } catch (error) {
      handleAxiosError(error);
    }
  };
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo}>
          E-Shop
        </Link>
      </div>
      <div className={styles.right}>
        {user ? (
          <Link to="/profile" className={styles.link}>
            <FaUser /> {user.userName}
          </Link>
        ) : (
          <Link to="/login" className={styles.link}>
            <FaSignInAlt /> התחברות
          </Link>
        )}
        {user ? (
          <Link onClick={logout} to="/" className={styles.link}>
            <FaSignOutAlt /> התנתקות
          </Link>
        ) : (
          <Link to="/register" className={styles.link}>
            <FaUserPlus /> הרשמה
          </Link>
        )}

        <Link to="/cart" className={styles.link}>
          <div className={styles.cartIconWrapper}>
            <FaShoppingCart />
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </div>
          עגלה
        </Link>
      </div>
    </header>
  );
};

export default Header;
