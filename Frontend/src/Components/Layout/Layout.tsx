import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { Outlet } from "react-router-dom";
const mainStyle = {
  padding: "40px 0", //  מרווח פנימי למעלה ולמטה
  margin: "0 auto", //  מרכז את הקונטיינר אופקית
  maxWidth: "1200px", //  רוחב מקסימלי לקונטיינר
};
const Layout = () => {
  return (
    <div>
      <Header />
      <div style={mainStyle}>
        <Outlet /> {/* תוכן הדף */}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
