import React from "react";
import { NavLink } from "react-router-dom";
import emptyBox from "/box.png";
import "./EmptyCart.css";

export default function EmptyCart() {
  return (
    <>
      <div className="empty" id="empty">
        <span className="empty-label">
          Oops! Your cart is empty. <br />
        </span>
        <NavLink to="/products" className="empty-link">
          Let's Go Shopping
        </NavLink>
        <img src={emptyBox} className="empty-img" alt="" />
      </div>
    </>
  );
}
