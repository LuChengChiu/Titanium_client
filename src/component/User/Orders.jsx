import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ORDERS_URL = "/order";

import "./Orders.css";

export default function Orders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState();
  useEffect(() => {
    getOrders();
  }, []);
  const getOrders = async () => {
    const userId = currentUser.uid;
    const ordersRes = await axios.post(ORDERS_URL, { userId });
    console.log(ordersRes.data);
    setOrders(ordersRes.data);
  };

  const testUser = "SmYgRrDHN7aO4BxQIyGbU8TIZys1";
  return (
    <>
      <section id="orders">
        <h1 className="user-title">Orders</h1>
        <table className="orders-table">
          <thead>
            <tr>
              <th>order id</th>
              <th>date</th>
              <th>status</th>
              <th>sum</th>
              <th></th>
            </tr>
          </thead>
          {orders?.length > 0 ? (
            <tbody>
              {orders.map((order, index) => {
                return (
                  <>
                    <tr key={index}>
                      <td>{order.order_id}</td>
                      <td>{order.order_date.split("T")[0]}</td>
                      <td>{order.status}</td>
                      <td>{order.total_value.toLocaleString()}</td>
                      <td>
                        <NavLink
                          to={`${order.order_id}`}
                          className="detail-link"
                        >
                          view
                        </NavLink>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          ) : (
            <div className="noOrder-frame">
              <span className="noOrder-text">
                You don't have any order yet!
              </span>
              {/* <br /> */}
              <NavLink to="/products" className="empty-link">
                go shopping
              </NavLink>
            </div>
          )}
        </table>
      </section>
    </>
  );
}
