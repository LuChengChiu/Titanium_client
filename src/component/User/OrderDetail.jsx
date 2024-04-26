import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import axios from "../api/axios";
import Loading from "../Layout/Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import "./OrderDetail.css";

const ORDER_ID_URL = "/order/id";
const ORDER_ID_ITEM_URL = "/order/item";
const PRODUCT_IDS_URL = "/products/ids";
const LOGISTICS_URl = "/cart/delivery";
const PAYMENT_URL = "/cart/payment";

export default function OrderDetail() {
  const { orderId } = useParams();
  const [theOrder, setTheOrder] = useState();
  const [sendAndPay, setSendAndPay] = useState();
  useEffect(() => {
    wholeOrder();
  }, []);
  useEffect(() => {
    if (theOrder) {
      logisticAndPay();
    }
  }, [theOrder]);
  const getTheOrder = async () => {
    const theOrderRes = await axios.post(ORDER_ID_URL, { orderId });
    return theOrderRes.data[0];
  };
  const getOrderItem = async () => {
    const itemsRes = await axios.post(ORDER_ID_ITEM_URL, { orderId });
    return itemsRes.data;
  };
  const wholeOrder = async () => {
    const resultO = await getTheOrder();
    const resultI = await getOrderItem();
    const {
      order_id,
      order_date,
      status,
      logistic_id,
      payment_method_id,
      total_value,
    } = resultO;
    const items = resultI.reduce(
      (acc, { product_id, quantity, price_per_item, subtotal }) => {
        acc.push({ product_id, quantity, price_per_item, subtotal });
        return acc;
      },
      []
    );
    const ids = items.map((item) => item.product_id);
    const products = await axios
      .post(PRODUCT_IDS_URL, { ids })
      .then((result) => {
        return result.data;
      });
    const combinedList = [];
    items?.forEach((itemA) => {
      const itemB = products.info?.find(
        (info) => info.product_id === itemA.product_id
      );
      if (itemB) {
        const imgUrls = products.imgs
          .find((imgSet) =>
            imgSet.some((img) =>
              img.public_id.includes(`zippo${itemA.product_id}_`)
            )
          )
          .map((img) => img.secure_url);

        const combinedItem = {
          product_id: itemA.product_id,
          name: itemB.name,
          brand: itemB.brand,
          category: itemB.category,
          theme: itemB.theme,
          price: itemB.price,
          sale: itemB.sale,
          material: itemB.material,
          origin: itemB.origin,
          size: itemB.size,
          quantity: itemA.quantity,
          img: imgUrls,
        };
        combinedList.push(combinedItem);
      }
    });
    setTheOrder({
      order_id,
      order_date,
      status,
      logistic_id,
      payment_method_id,
      total_value,
      products: combinedList,
    });
  };
  const logisticAndPay = async () => {
    try {
      const logRes = await axios.get(LOGISTICS_URl);
      const payRes = await axios.get(PAYMENT_URL);
      if (logRes && payRes) {
        const log = logRes.data.find((log) => {
          return theOrder.logistic_id === log.logistic_id;
        });
        const pay = payRes.data.find((pay) => {
          return theOrder.payment_method_id === pay.payment_method_id;
        });
        console.log("88", log, pay);
        setSendAndPay({ logistic: log, payment: pay });
      }
    } catch (err) {
      "logistic and payment GET Error:", err;
    }
  };
  console.log("Final work:", theOrder);
  // Scroll Listener
  window.addEventListener("scroll", function () {
    const scrollOffset =
      window.pageYOffset || document.documentElement.scrollTop;
    document.documentElement.style.setProperty(
      "--scrollOffset",
      scrollOffset + "px"
    );
  });
  return (
    <>
      <section id="orderDetail">
        <NavLink to="/user/orders" className="back-link">
          <FontAwesomeIcon
            icon={fas.faChevronLeft}
            style={{
              fontSize: "0.8em",
              marginRight: "5px",
              marginBottom: "1px",
            }}
          />
          back
        </NavLink>
        <h1 className="user-title">Order ID: {orderId}</h1>
        {theOrder ? (
          <div className="products-zone">
            {theOrder?.products?.map((product) => {
              return (
                <NavLink
                  to={`/products/${product.product_id}`}
                  className="order-product-link"
                >
                  <div className="order-product-card">
                    <img
                      className="product-card-img"
                      src={product.img[0]}
                      alt={`product: ${product.product_id} img`}
                    />
                    <div className="card-info">
                      <h6 className="card-name">{product.name}</h6>
                      <div className="card-infos">
                        <span>
                          ${" "}
                          {(product.sale
                            ? product.sale
                            : product.price
                          ).toLocaleString()}
                        </span>
                        <span>x{product.quantity}</span>
                      </div>
                    </div>
                  </div>
                </NavLink>
              );
            })}{" "}
          </div>
        ) : (
          <Loading />
        )}
        <div className="order-info-zone">
          <table>
            <tr>
              <th className="label-big">Order</th>
              <td></td>
            </tr>
            <tr>
              <th>Date</th>
              <td>{theOrder?.order_date.split("T")[0]}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{theOrder?.status}</td>
            </tr>
            <tr>
              <th>Summary</th>
              <td>$ {theOrder?.total_value.toLocaleString()}</td>
            </tr>
            <tr>
              <th>Delivery</th>
              <td>{sendAndPay?.logistic.logistic_name}</td>
            </tr>
            <tr>
              <th>Payment</th>
              <td>{sendAndPay?.payment.payment_method_name}</td>
            </tr>
          </table>
        </div>
      </section>
    </>
  );
}
