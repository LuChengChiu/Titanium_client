import React, { useEffect } from "react";
import sendto711img from "/711_logo.png";
import sendtoFM from "/FM_logo.png";
import "./ConfirmOrder.css";

const CARDEXPIRY_REGEX = /^(0[1-9]|1[0-2])\/(0[0-9]|[1-9][0-9])$/;
const SendToWhere = ({ selectedDelivery }) => {
  console.log("WTF M3", selectedDelivery);
  if (selectedDelivery.name) {
    console.log("SDSDSDSD");
    if (selectedDelivery.name.includes("express")) {
      return (
        <div className="send-to-frame">
          <label htmlFor="address" className="loc-label">
            send to:
          </label>
          <label htmlFor="address" className="detail-input">
            <input
              type="text"
              name="address"
              id="address"
              required
              placeholder="&nbsp;"
            />
            <span className="detail-label">address</span>
            <span className="focus-bg"></span>
          </label>
        </div>
      );
    } else {
      return (
        <div className="send-to-frame frame-pickup">
          {selectedDelivery.name.includes("7-11") ? (
            <img src={sendto711img} alt="7-11 icon" className="sendto-icon" />
          ) : (
            <img src={sendtoFM} alt="FamilyMart icon" className="sendto-icon" />
          )}
          <label htmlFor="pickup-store-btn" className="loc-label pickup-label">
            select pickup store:
          </label>

          <button className="pickup-store-btn">Find a store</button>
        </div>
      );
    }
  } else {
    return "";
  }
};

export default function ConfirmOrder({
  processPhaseHandler,
  selectedDelivery,
}) {
  return (
    <section className="phase" id="confirm-order">
      <div className="detail-frame">
        <h4 className="process-title">delivery detail</h4>
        <div className="detail-frame-info">
          <span className="loc-label">selected delivery method:</span>
          <label htmlFor="recipient-name" className="detail-input">
            <input
              type="text"
              name="recipient-name"
              id="recipient-name"
              required
              placeholder="&nbsp;"
            />
            <span className="detail-label">recipient name</span>
            <span className="focus-bg"></span>
          </label>
          <span className="delivery-detail-note">
            Please fill in recipient's full name to facilitate smooth delivery.
          </span>
          <label htmlFor="recipient-contact-num" className="detail-input">
            <input
              type="text"
              name="recipient-contact-num"
              id="recipient-contact-num"
              required
              placeholder="&nbsp;"
            />
            <span className="detail-label">recipient contact number</span>
            <span className="focus-bg"></span>
          </label>
          <div className="detail-line" />
          <SendToWhere selectedDelivery={selectedDelivery} />
        </div>
      </div>
      <div className="detail-frame">
        <h4 className="process-title">payment detail</h4>
        <div className="detail-frame-info">
          <span>selected payment method: </span>
          <div className="creditCard">
            <form id="credit">
              <input
                type="tel"
                className="cc-number"
                maxLength="19"
                name="credit-number"
                pattern="\d*"
                placeholder="Card Number"
              />
              <input
                type="tel"
                className="cc-expires"
                maxLength="7"
                name="credit-expires"
                pattern="\d*"
                placeholder="MM / YY"
              />
              <input
                type="tel"
                className="cc-cvc"
                maxLength="4"
                name="credit-cvc"
                pattern="\d*"
                placeholder="CVC"
              />
            </form>
            {/* <label htmlFor="recipient-name" className="detail-input">
              <input
                type="text"
                name="recipient-name"
                id="recipient-name"
                required
                placeholder="&nbsp;"
              />
              <span className="detail-label">recipient name</span>
              <span className="focus-bg"></span>
            </label> */}
            <label htmlFor="" className="detail-input">
              <input type="text" />
              <span className="detail-label">card number</span>
              <span className="focus-bg"></span>
            </label>
            <label htmlFor="">
              <input type="text" />
              <span>cardholder name</span>
            </label>
            <label htmlFor="">
              <input type="text" />
              <span>expiry data (MM/YY)</span>
            </label>
            <label htmlFor="">
              <input type="text" />
              <span>CVV/CVC</span>
            </label>
          </div>
        </div>
      </div>
      <div className="detail-frame">
        <h4 className="process-title">remark for order</h4>
        <div className="detail-frame-info">
          <textarea name="remark" />
        </div>
      </div>
      <button onClick={processPhaseHandler}></button>
    </section>
  );
}
