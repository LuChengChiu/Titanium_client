import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./component/context/AuthContext";
import Layout from "./component/Layout/Layout";
import Home from "./component/Home/Home";
import Register from "./component/User/Register";
import Login from "./component/User/Login";
import ForgetPwd from "./component/User/ForgetPwd";
import User from "./component/User/User";
import Profile from "./component/User/Profile";
import ChangePwd from "./component/User/ChangePwd";
import Orders from "./component/User/Orders";
import OrderDetail from "./component/User/OrderDetail";
import Wishlist from "./component/User/Wishlist";
import Shop from "./component/Shop/Shop";
import Sale from "./component/Shop/Sale";
import ShopZippo from "./component/Shop/ShopZippo";
import ShopAcc from "./component/Shop/ShopAcc";
import Product from "./component/Products/Product";
import Cart from "./component/Cart/Cart";
import OrderSuccess from "./component/Cart/OrderSuccess";
import ProtectedRoute from "./component/Routes/ProtectedRoute";
import Famic2c from "./component/Cart/LogisticsRedirect/Famic2c";
import Hilifec2c from "./component/Cart/LogisticsRedirect/Hilifec2c";
import Okmartc2c from "./component/Cart/LogisticsRedirect/Okmartc2c";
import Unimartc2c from "./component/Cart/LogisticsRedirect/Unimartc2c";
import "./App.css";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route Component={Layout}>
              <Route exact path="/" Component={Home} />
              <Route exact path="register" Component={Register} />
              <Route exact path="login" Component={Login} />
              <Route exact path="forgetPassword" Component={ForgetPwd} />
              <Route exact path="products" Component={Shop} />
              <Route exact path="sale" Component={Sale} />
              <Route exact path="zippo" Component={ShopZippo} />
              <Route exact path="acc" Component={ShopAcc} />
              <Route path="products/:id" Component={Product} />
              <Route exact path="/user" Component={ProtectedRoute}>
                <Route path="/user" Component={User}>
                  <Route index Component={Profile} />
                  <Route path="changePassword" Component={ChangePwd} />
                  <Route path="orders" Component={Orders} />
                  <Route path="orders/:orderId" Component={OrderDetail} />
                  <Route path="wishlist" Component={Wishlist} />
                </Route>
              </Route>
              <Route path="/cart" Component={ProtectedRoute}>
                <Route index Component={Cart} />
                <Route path="/cart/orderSuccess" Component={OrderSuccess} />
              </Route>
              <Route path="/cart/famic2c" Component={Famic2c} />
              <Route path="/cart/hilifec2c" Component={Hilifec2c} />
              <Route path="/cart/okmartc2c" Component={Okmartc2c} />
              <Route path="/cart/unimartc2c" Component={Unimartc2c} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
