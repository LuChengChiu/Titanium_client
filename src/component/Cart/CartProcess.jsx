import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { NavLink } from "react-router-dom";
import ConfirmOrder from "./ConfirmOrder";
import "./CartProcess.css";

const DELIVERYWAY_URL = "/cart/delivery";
const PAYMENTWAY_URL = "/cart/payment";
const MAP_URL = "/cart/map";
const ECPAY_URL = "/cart/ecpay";

export default function CartProcess({ sumPrice, products }) {
  const [discountSum, setDiscountSum] = useState(0);
  const [logistics, setLogistics] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([
    { payment_id: 1, payment_name: "取貨付款", payment_value: "Y" },
    { payment_id: 2, payment_name: "線上付款", payment_value: "N" },
  ]);
  const [selectedDelivery, setSelectedDelivery] = useState({
    logistic_name: "",
    logistic_fee: "",
    payment_method: "",
  });
  const [mapReady, setMapReady] = useState();
  const [payReady, setPayReady] = useState();
  const [nextProcess, setNextProcess] = useState(false);
  useEffect(() => {
    getDeliveryM();
    // getPaymentM();
  }, []);

  const getDeliveryM = async () => {
    const logisticsRes = await axios.get(DELIVERYWAY_URL);
    // console.log("delivery", logisticsRes.data);
    setLogistics(logisticsRes.data);
    console.log(logisticsRes.data);
  };
  const getPaymentM = async () => {
    const paymentMethodRes = await axios.get(PAYMENTWAY_URL);
    console.log("payment", paymentMethodRes.data);
    setPaymentMethod(paymentMethodRes.data);
  };
  useEffect(() => {
    let tempDiscountSum = 0;
    products.forEach((item) => {
      // console.log(item);
      if (item.product.info.sale) {
        tempDiscountSum += item.product.info.price - item.product.info.sale;
      }
    });
    setDiscountSum(tempDiscountSum);
  }, [products]);

  const deliveryHandler = (e) => {
    const currentDelivery = e.target.value;
    const payWay = document.getElementById("payment-way");
    Array.from(payWay.options).forEach((option) => {
      option.style.display = "";
    });
    if (currentDelivery.includes("pickup & pay")) {
      Array.from(payWay.options).forEach((option) => {
        if (option.value !== currentDelivery) {
          option.style.display = "none";
        }
      });
    } else {
      Array.from(payWay.options).forEach((option) => {
        if (option.value.includes("pickup & pay")) {
          option.style.display = "none";
        }
      });
    }
    if (currentDelivery) {
      document
        .querySelector("select[name=payment-way]")
        .removeAttribute("disabled", false);
    } else {
      document
        .querySelector("select[name=payment-way]")
        .setAttribute("disabled", true);
    }
    const fee = () => {
      const delivery = logistics.find((item) => {
        return item.logistic_id == currentDelivery;
      });
      return delivery ? delivery.logistic_fee : 0;
    };
    setSelectedDelivery({
      ...selectedDelivery,
      logistic_name: currentDelivery,
      logistic_fee: fee(),
    });
  };
  const paymentHandler = (e) => {
    console.log(e.target.value);
    setSelectedDelivery({
      ...selectedDelivery,
      payment_method: e.target.value,
    });
  };
  const processPhaseHandler = async (e) => {
    e.preventDefault();
    // setNextProcess(!nextProcess);
    const itemName = (description) => {
      for (let i = 0; i < products.length; i++) {
        description += products[i].product.info.name + " x " + products[i].q;
        return description;
      }
    };
    const items = (allItem) => {
      for (let i = 0; i < products.length; i++) {
        allItem += products[i].product.info.name;
        if (i + 1 != products.length) {
          allItem += ", ";
        }
        return allItem;
      }
    };
    try {
      const LogisticsSubType = selectedDelivery.logistic_name;
      const IsCollection = selectedDelivery.payment_method;
      console.log(IsCollection, LogisticsSubType);
      if (IsCollection == "Y") {
        const openMapRes = await axios
          .post(
            MAP_URL,
            {
              LogisticsSubType,
              IsCollection,
            },
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              withCredentials: true,
            }
          )
          .then((result) => {
            return result.data;
          });
        console.log(openMapRes);
        let container = document.getElementById("mapContainer");

        console.log(container, LogisticsSubType);
        container.innerHTML = openMapRes;
        // setMapReady(openMapRes);
      } else {
        const LogisticsSubType = selectedDelivery.logistic_name.toLowerCase();
        const amount = sumPrice - discountSum + selectedDelivery.logistic_fee;
        let description = "";
        let allItem = "";
        const itemDescription = itemName(description);
        const allItems = items(allItem);
        console.log(
          amount,
          products,
          products.length,
          itemDescription,
          allItems
        );
        const ecpayRes = await axios
          .post(
            ECPAY_URL,
            {
              amount,
              itemDescription,
              allItems,
              LogisticsSubType,
            },
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              withCredentials: true,
            }
          )
          .then((result) => {
            return result.data;
          });
        console.log(ecpayRes);
        let container = document.getElementById("mapContainer");

        console.log(container);
        container.innerHTML = ecpayRes;
        setPayReady(ecpayRes);
      }
    } catch (err) {
      console.log("Submit Checkout Error:", err);
    }
  };
  useEffect(() => {
    if (mapReady && !payReady) {
      const form = document.getElementById("_form_map");
      console.log(form);
      form?.submit();
    } else {
      const form = document.getElementById("_form_aiochk");
      console.log(form);
      form?.submit();
    }
  }, [mapReady, payReady]);
  return (
    <section id="cart-process">
      {/* <div className="process-phase">
        <span className="phase-text">
          {nextProcess ? "almost done" : "fill information"}
        </span>
        <button onClick={processPhaseHandler}>GG</button>
        <div className="process-bar">
          <div
            className={
              nextProcess
                ? "process-bar-start process-bar-move"
                : "process-bar-start"
            }
          ></div>
        </div>
      </div> */}
      <div className={nextProcess ? "phase-all phase-move" : "phase-all"}>
        <div className={nextProcess ? "phase " : "phase"}>
          <div className="method-selection">
            <h4 className="process-title">delivery & payment method</h4>
            <label htmlFor="delivery-way" className="method-label">
              delivery method{" "}
            </label>
            <select
              name="delivery-way"
              id="delivery-way"
              className="method-select"
              onChange={deliveryHandler}
            >
              <option value="">-- delivery method --</option>
              {logistics.map((m, index) => {
                return (
                  <option value={m.logistic_id} key={index}>
                    {m.logistic_name}
                  </option>
                );
              })}
            </select>
            <label htmlFor="payment-way" className="method-label">
              payment method{" "}
            </label>
            <select
              name="payment-way"
              id="payment-way"
              className="method-select"
              onChange={paymentHandler}
            >
              <option value="">-- payment method --</option>
              {paymentMethod.map((m, index) => {
                return (
                  <option value={m.payment_value} key={index}>
                    {m.payment_name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="cart-summary">
            <h4 className="process-title">cart summary</h4>
            <div className="cart-summary-infos">
              <span className="cart-sum-label">item subtotal:</span>
              <span className="cart-sum-data">
                ${sumPrice.toLocaleString()}
              </span>
              <span className="cart-sum-label">discounts:</span>
              <span className="cart-sum-data">
                - ${discountSum.toLocaleString()}
              </span>
              <span className="cart-sum-label">delivery fee:</span>
              <span className="cart-sum-data">
                + $
                {selectedDelivery.logistic_fee
                  ? selectedDelivery.logistic_fee
                  : 0}
              </span>
              <span className="cart-sum-label">total:</span>
              <span className="cart-sum-data">
                $
                {(
                  sumPrice -
                  discountSum +
                  selectedDelivery.logistic_fee
                )?.toLocaleString()}
              </span>
            </div>
          </div>
          <button className="process-btn" onClick={processPhaseHandler}>
            go checkout
          </button>
          <NavLink to="/cart/orderSuccess">Next</NavLink>
        </div>
        <div id="mapContainer"></div>
      </div>
    </section>
  );
}
