import React from "react";
import { NavLink } from "react-router-dom";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import "./OrderSuccess.css";

const CHECK_ORDER_URL = "/order";
const CREATE_ORDER_URL = "/order/create";

export default function OrderSuccess() {
  const orderCheck = async () => {
    try {
      const userId = "tkHvbJBZ5iMQbQB8d7H81d8odug2";
      const checkOrderRes = await axios
        .post(
          CHECK_ORDER_URL,
          {
            userId,
          },
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            withCredentials: true,
          }
        )
        .then((result) => {
          return result.data;
        });
      console.log(checkOrderRes);
    } catch (err) {
      console.log("orderCheck Error:", err);
    }
  };
  const orderCreate = async () => {
    try {
      const userId = "tkHvbJBZ5iMQbQB8d7H81d8odug2";
      const orderNo = userId.substring(0, 5) + new Date().getTime();
      const sum = 8888;
      const logistic = "UNIMARTC2C";
      const payment = 1;
      const createRes = await axios
        .post(
          CREATE_ORDER_URL,
          {
            userId,
            orderNo,
            sum,
            logistic,
            payment,
          },
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            withCredentials: true,
          }
        )
        .then((result) => {
          return result.data;
        });
      console.log(createRes);
    } catch (err) {
      console.log("orderCreate Error: ", err);
    }
  };
  const cloud = async () => {
    try {
      const cloudRes = await axios.get("/order/cloud");
      console.log(cloudRes);
    } catch (err) {
      console.log("cloud error:", err);
    }
  };
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
