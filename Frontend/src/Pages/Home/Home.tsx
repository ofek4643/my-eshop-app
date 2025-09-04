import { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { fetchProducts } from "../../api/product";
import { Product } from "../../types/Product";
import { handleAxiosError } from "../../utils/errorHandler";
import { Link } from "react-router-dom";
// קומפוננטה של דף הבית
const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // חישוב של כמה עמודים בדף הבית של מוצרים

  const PRODUCTS_PER_PAGE = 4;
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );
  const featuredImages = products.slice(0, 3);

  // פוקנציה לדף הבא של המוצרים המובחרים
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % featuredImages.length);

  // פוקנציה לדף הקודם של המוצרים המובחרים
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + featuredImages.length) % featuredImages.length
    );

  // משיכת המוצרים ממסד הנתונים
  useEffect(() => {
    async function getProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        handleAxiosError(error);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }, []);

  // כל 3 שניות מזיז קדימה את המוצרים המובחרים
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [featuredImages]);

  return (
    <div className={styles.home}>
      {loading && <div className={styles.loadingSpinner}></div>}
      {featuredImages.length > 0 && (
        <div className={styles.carousel}>
          <img
            src={featuredImages[currentSlide].imageUrl}
            className={styles.carouselImage}
            alt={featuredImages[currentSlide].name}
          />
          <button className={styles.arrowLeft} onClick={prevSlide}>
            ❮
          </button>
          <button className={styles.arrowRight} onClick={nextSlide}>
            ❯
          </button>
          <div className={styles.caption}>
            <div className={styles.info}>
              {featuredImages[currentSlide].name} (₪
              {featuredImages[currentSlide].price})
            </div>
          </div>
        </div>
      )}

      <h2 className={styles.title}>מוצרים אחרונים</h2>
      <div className={styles.productContianer}>
        {currentProducts.map((product) => (
          <Link
            className={styles.linkProduct}
            key={product._id}
            to={`/product/${product._id}`}
          >
            <div className={styles.card}>
              <img
                src={product.imageUrl}
                alt={product.name}
                className={styles.cardImage}
              />
              <div className={styles.cardTitle}>{product.name}</div>
              <div className={styles.cardPrice}>₪{product.price}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`${styles.pageButton} ${
              currentPage === index + 1 ? styles.active : ""
            }`}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Home;
