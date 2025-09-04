import { useEffect, useState } from "react";
import styles from "./ProductPage.module.css";
import { Link, useParams } from "react-router-dom";
import { fetchProductById } from "../../api/product";
import { handleAxiosError } from "../../utils/errorHandler";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchUserCartThunk } from "../../store/slices/cartSlice";
import { RootState, AppDispatch } from "../../store/store";
import { addToCartApi } from "../../api/Cart";
import { toast } from "react-toastify";

// קומפוננטה למוצר
const ProductPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState(0);
  const [amount, setAmount] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);

  const [popout, setPopout] = useState(false);
  const [popoutError, setPopoutError] = useState(false);
  // שימוש בחנות בשביל נתונים
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.cart.items);
  const userCart = useSelector((state: RootState) => state.cart.userCart);
  const user = useSelector((state: RootState) => state.user.user);
  const cartToShow = user ? userCart : items;

  // שליפת נתוני המוצר בפתיחת הקומפוננטה
  useEffect(() => {
    async function getProduct() {
      if (!productId) return;
      try {
        setLoadingPage(true);
        const data = await fetchProductById(productId);
        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setImageUrl(data.imageUrl);
        setStock(data.stock);
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoadingPage(false);
      }
    }
    getProduct();
  }, [productId]);
  const cartItem = cartToShow.find((item) => item._id === productId);
  const quantityInCart = cartItem ? cartItem.amount : 0;
  const handleAddToCart = async (): Promise<void> => {
    if (!user) {
      if (!productId) return;

      if (quantityInCart + amount > stock) {
        setPopoutError(true);
        return; // לא מוסיפים לעגלה
      }

      // משתמש לא מחובר → עגלת אורח
      dispatch(
        addToCart({
          _id: productId,
          name,
          price,
          amount,
          stock, // אין res.productStock כי אין שרת, לוקחים מהסטוק המקומי
          imageUrl,
        })
      );
      toast.success("המוצר נוסף לעגלת אורח");
      setPopout(true);
      return; // יוצאים מהפונקציה, לא קוראים לשרת
    }

    // משתמש מחובר → הולך לשרת
    try {
      setLoadingAdd(true);
      if (!productId) return;
      const res = await addToCartApi({ productId, amount });
      await dispatch(fetchUserCartThunk());
      setPopout(true);
      toast.success(res.message);
    } catch (err) {
      handleAxiosError(err);
      setPopoutError(true);
    } finally {
      setLoadingAdd(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {loadingPage ? (
        <div className={styles.loadingSpinner}></div>
      ) : (
        <div>
          <Link className={styles.backBtn} to="/">
            ← חזרה לחנות
          </Link>
          <div className={styles.container}>
            <div className={styles.imgContainer}>
              {imageUrl && <img src={imageUrl} alt={name} />}
            </div>
            <div className={styles.infoContainer}>
              <h1 className={styles.headerProduct}>{name}</h1>
              <p className={styles.descriptionProduct}>{description}</p>
              <hr className={styles.separator} />
              <h2 className={styles.priceProduct}>מחיר: ₪{price}</h2>
              {stock > 0 ? (
                <>
                  <div className={styles.selectDiv}>
                    כמות:
                    <select
                      className={styles.amountSelect}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    >
                      {[...Array(stock)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    disabled={loadingAdd}
                    onClick={handleAddToCart}
                    className={
                      loadingAdd
                        ? styles.addToCartBtnLoading
                        : styles.addToCartBtn
                    }
                  >
                    {loadingAdd ? (
                      <>
                        <span>מוסיף...</span>
                        <span className={styles.loadingSpinnerAdd}></span>
                      </>
                    ) : (
                      "הוספה לסל"
                    )}
                  </button>
                </>
              ) : (
                <button disabled className={styles.noStockBtn}>
                  אזל המלאי
                </button>
              )}
            </div>

            {popout && (
              <div className={styles.backdrop}>
                <div className={styles.popout}>
                  <button
                    className={styles.close}
                    onClick={() => setPopout(false)}
                  >
                    ✕
                  </button>

                  <h2 className={styles.headerPopout}>
                    ✅ המוצר נוסף לעגלה בהצלחה!
                  </h2>

                  <p className={styles.textPopout}>
                    יש כעת{" "}
                    <b>
                      {cartToShow.reduce(
                        (total, item) => total + item.amount,
                        0
                      )}{" "}
                      פריטים
                    </b>{" "}
                    בעגלה. <br />
                    <b>
                      סה״כ לתשלום: ₪
                      {cartToShow.reduce(
                        (total, item) => total + item.amount * item.price,
                        0
                      )}
                    </b>
                  </p>

                  <div className={styles.actions}>
                    <Link to="/cart" className={styles.primary}>
                      צפה בעגלה ועבור לתשלום
                    </Link>
                    <button
                      onClick={() => setPopout(false)}
                      className={styles.secondary}
                    >
                      המשך בקניות
                    </button>
                  </div>
                </div>
              </div>
            )}

            {popoutError && (
              <div className={styles.backdrop}>
                <div className={styles.popout}>
                  <button
                    className={styles.close}
                    onClick={() => setPopoutError(false)}
                  >
                    ✕
                  </button>

                  <h2 className={styles.headerPopout} style={{ color: "red" }}>
                    ❌ שגיאה בהוספה לעגלה
                  </h2>

                  <p className={styles.textPopout}>
                    לא ניתן להוסיף את הכמות שבחרת לעגלה.
                    <br />
                    המלאי הזמין: <b>{stock - quantityInCart}</b> בלבד.
                  </p>

                  <div className={styles.actions}>
                    <button
                      onClick={() => setPopoutError(false)}
                      className={styles.secondary}
                    >
                      סגור
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
