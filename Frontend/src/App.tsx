import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout/Layout";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import Cart from "./Pages/Cart/Cart";
import MyProfile from "./Pages/MyProfile/MyProfile";
import Privacy from "./Pages/Privacy/Privacy";
import Terms from "./Pages/Terms/Terms";
import Accessibility from "./Pages/Accessibility/Accessibility";
import ForgotPassword from "./Pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import ProductPage from "./Pages/ProductPage/ProductPage";
import AddressDelivery from "./Pages/AddressDelivery/AddressDelivery";
import { ToastContainer } from "react-toastify";
import OrderSummary from "./Pages/OrdersSummary/OrdersSummary";
import Payment from "./Pages/Payment/Payment";
import VerifyUser from "./Pages/VerifyUser/VerifyUser";
import MyOrder from "./Pages/MyOrder/MyOrder";
import MyOrders from "./Pages/MyOrders/MyOrders";
const App = () => {
  return (
    <>
      <Router>
        <ToastContainer
          position="bottom-right"
          closeOnClick
          rtl
          draggable
          theme="light"
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="cart" element={<Cart />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="terms" element={<Terms />} />
            <Route path="accessibility" element={<Accessibility />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password/:token" element={<ResetPassword />} />
            <Route path="verify/:userId/:token" element={<VerifyUser />} />
            <Route path="product/:id" element={<ProductPage />} />
            <Route path="addressDelivery" element={<AddressDelivery />} />
            <Route path="orderSummary" element={<OrderSummary />} />
            <Route path="payment" element={<Payment />} />
            <Route path="order/:id" element={<MyOrder />} />
            <Route path="/profile/my-orders" element={<MyOrders />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
