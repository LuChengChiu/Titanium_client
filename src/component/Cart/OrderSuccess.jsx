import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import "./OrderSuccess.css";

export default function OrderSuccess() {
  return (
    <>
      <section id="orderSuccess">
        <FontAwesomeIcon className="icon" icon={far.faThumbsUp} />
        <span className="title">your order has been made!</span>
        <NavLink className="success-link" to="/user/orders">
          check your orders
        </NavLink>
      </section>
    </>
  );
}
