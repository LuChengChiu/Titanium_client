import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import CartItemCard from "./CartItemCard";
import CartProcess from "./CartProcess";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "./Cart.css";
import { useAuth } from "../context/AuthContext";

const USER_URL = "/user";
const CART_URL = "/cart";

export default function Cart() {
  const { currentUser } = useAuth();
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [sumPrice, setSumPrice] = useState(0);
  const [cartChange, setCartChange] = useState(0);
  useEffect(() => {
    if (currentUser.uid) {
      setUserId(currentUser.uid);
    }
  }, []);
  useEffect(() => {
    getCart();
  }, [userId, cartChange]);

  const getCart = async () => {
    try {
      const cartRes = await axios.post(
        CART_URL,
        { userId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log("cartRes:", cartRes.data);
      let adjustCart = [];
      cartRes.data.forEach((item) => {
        let sameProduct = adjustCart.find(
          (i) => i.product_id === item.product_id
        );
        if (sameProduct) {
          sameProduct.quantity += item.quantity;
        } else {
          adjustCart.push({
            user_id: item.user_id,
            product_id: item.product_id,
            quantity: item.quantity,
          });
        }
      });
      // console.log("adjustedCart:", adjustCart);
      setCart(adjustCart);
    } catch (err) {
      console.log("getCart Error:", err);
    }
  };

  return (
    <div id="cart">
      <section className="carts">
        <h1 className="cart-title">
          <FontAwesomeIcon icon={fas.faCartShopping} /> shopping cart
        </h1>
        <div className="cart-tag">
          <ul className="cart-tag-list">
            <li className="tag1">product</li>
            <li className="tag2">
              <ul className="cart-tag-list2">
                <li>price</li>
                <li>quantity</li>
                <li>sub total</li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="line"></div>
        <CartItemCard
          cart={cart}
          sumPrice={sumPrice}
          setSumPrice={setSumPrice}
          products={products}
          setProducts={setProducts}
          cartChange={cartChange}
          setCartChange={setCartChange}
        ></CartItemCard>
        <div className="line" style={{ marginTop: "1.5em" }}></div>
        <span className="sum-price">
          Total Price: $ {sumPrice.toLocaleString()}
        </span>
      </section>
      <div className="cart-process">
        <CartProcess sumPrice={sumPrice} products={products} />
      </div>
    </div>
  );
}
