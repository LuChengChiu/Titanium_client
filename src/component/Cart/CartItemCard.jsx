import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "../api/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import Loading from "../Layout/Loading/Loading";
import EmptyCart from "./EmptyCart";
import { useAuth } from "../context/AuthContext";
import "./CartItemCard.css";

const PRODUCT_ID_URL = "/products/id";
const REMOVE_CART_URL = "/cart/remove";

const Card = ({ products, setProducts, limitQ, cartChange, setCartChange }) => {
  const [pQ, setPQ] = useState([]);
  const { currentUser } = useAuth();
  const [adjustedProducts, setAdjustedProduct] = useState();
  useEffect(() => {
    let pro = [...products];
    setAdjustedProduct(pro);
  }, [products]);
  // let adjustedProducts = [...products];
  let i = 0;
  adjustedProducts?.forEach((element) => {
    element.index = i;
    i += 1;
  });
  // console.log(adjustedProducts);
  useEffect(() => {
    if (pQ.length == 0) {
      let initialQList = [];
      adjustedProducts?.forEach((element) => {
        initialQList.push(element.q);
      });
      setPQ(initialQList);
    } else {
    }
  }, [adjustedProducts]);
  // useEffect(() => {
  //   console.log("pQ", pQ);
  // }, [pQ]);
  const changeQHandler = (e) => {
    let changeQ = [...pQ];
    let i = e.target.id.substring(1);
    console.log("DEBUG", adjustedProducts[i]);
    if (adjustedProducts[i]?.q > 0 && adjustedProducts[i]?.q <= limitQ) {
      if (
        e.target.id.substring(0, 1) == "+" &&
        adjustedProducts[i]?.q < limitQ
      ) {
        adjustedProducts[i] = {
          ...adjustedProducts[i],
          q: adjustedProducts[i].q + 1,
        };
        changeQ[i] = changeQ[i] + 1;
      } else if (
        e.target.id.substring(0, 1) == "-" &&
        adjustedProducts[i]?.q > 1
      ) {
        adjustedProducts[i] = {
          ...adjustedProducts[i],
          q: adjustedProducts[i].q - 1,
        };
        changeQ[i] = changeQ[i] - 1;
      }
    } else {
      let j = e.target.id;
      if (e.target.value <= limitQ && e.target.value >= 1) {
        changeQ[j] = parseInt(e.target.value);
        adjustedProducts[j] = {
          ...adjustedProducts[j],
          q: parseInt(e.target.value),
        };
      } else if (e.target.value > limitQ) {
        changeQ[j] = limitQ;
        adjustedProducts[j] = {
          ...adjustedProducts[j],
          q: limitQ,
        };
      } else {
        changeQ[j] = 1;
        adjustedProducts[j] = {
          ...adjustedProducts[j],
          q: 1,
        };
      }
    }
    setPQ(changeQ);
    setProducts(adjustedProducts);
  };
  const removeHandler = async (e) => {
    e.preventDefault();
    try {
      const userId = currentUser.uid;
      const productId = e.target.name;
      const elementId = e.target.id.substring(7);
      // console.log(userId, productId, e.target.id.substring(7));
      const removeRes = await axios.post(
        REMOVE_CART_URL,
        { userId, productId },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // console.log(removeRes.data);
      setCartChange(cartChange + 1);
    } catch (err) {
      console.log("removeHandler Error:", err);
    }
  };
  return (
    <>
      {adjustedProducts?.map((item, index) => {
        return (
          <div key={index} id={`card`} className={`${"card" + index}`}>
            <NavLink
              to={`/products/${item.product.info.product_id}`}
              target="_blank"
              className="cart-img-link"
            >
              <img
                className="cart-img"
                src={item.product.imgs[0].secure_url}
                alt={item.product.imgs[0].secure_url}
              />{" "}
            </NavLink>
            <div className="card-product-info">
              <span className="card-product-brand">
                {item.product.info.brand}
              </span>
              <h3 className="card-product-name">{item.product.info.name}</h3>
              {item.product.info.size ? (
                <span className="card-product-detail">
                  Size: {item.product.info.size}
                </span>
              ) : (
                ""
              )}
            </div>{" "}
            <span
              className={
                !item.product.info.sale
                  ? "card-product-detail"
                  : "card-product-detail card-unit-price"
              }
            >
              ${item.product.info.price.toLocaleString()}{" "}
              <span className="card-sale-price">
                {item.product.info.sale
                  ? `$ ${item.product.info.sale.toLocaleString()}`
                  : ""}
              </span>
            </span>
            <div className="product-quantity">
              <label htmlFor={"-" + item.index} className="card-q-btn">
                <input
                  type="button"
                  id={"-" + item.index}
                  onClick={changeQHandler}
                />{" "}
                <FontAwesomeIcon icon={fas.faMinus} />
              </label>
              <input
                className="card-product-q"
                type="number"
                id={item.index}
                onChange={changeQHandler}
                value={pQ[item.index]}
              />
              <label htmlFor={"+" + item.index} className="card-q-btn">
                <input
                  type="button"
                  id={"+" + item.index}
                  onClick={changeQHandler}
                />{" "}
                <FontAwesomeIcon icon={fas.faPlus} />
              </label>
            </div>
            <span className="card-product-detail" id="sub-total">
              $
              {item.product.info.sale
                ? (item.product.info.sale * pQ[item.index]).toLocaleString()
                : (item.product.info.price * pQ[item.index]).toLocaleString()}
            </span>
            <input
              type="button"
              className="remove-btn"
              value="x"
              id={`cardbtn${item.index}`}
              name={item.product.info.product_id}
              onClick={removeHandler}
            />
          </div>
        );
      })}
    </>
  );
};
const LoaderEmpty = () => {
  const [load, setLoad] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 2000);
  }, []);
  return <>{load ? <Loading /> : <EmptyCart />}</>;
};
export default function CartItemCard({
  cart,
  setSumPrice,
  products,
  setProducts,
  cartChange,
  setCartChange,
}) {
  const [limitQ, setLimitQ] = useState(10);

  useEffect(() => {
    getProduct();
  }, [cart]);
  const getProduct = async () => {
    let products = [];
    let productQuantity = [];
    for (let i = 0; i < cart.length; i++) {
      try {
        let id = cart[i].product_id;
        const theProductRes = await axios
          .post(
            PRODUCT_ID_URL,
            { id },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          )
          .then((response) => {
            return response.data;
          });
        // console.log(theProductRes);
        products.push({
          product: theProductRes,
          q: cart[i].quantity,
        });
        productQuantity.push({
          product_id: theProductRes.info.product_id,
          quantity: cart[i].quantity,
        });
      } catch (err) {
        console.log("Cart getProduct Error:", err);
      }
    }
    // console.log("products", products, productQuantity);
    setProducts(products);
  };
  useEffect(() => {
    // console.log("CartItem products change", products);
    let tempSum = 0;
    products.forEach((product) => {
      // console.log(product);
      if (product.product.info.sale) {
        tempSum += product.product.info.sale * product.q;
      } else {
        tempSum += product.product.info.price * product.q;
      }
    });
    setSumPrice(tempSum);
  }, [products]);

  window.addEventListener("load", function () {
    console.log("DONE LOADING");
    document.getElementById("card").innerHTML = "DONE LOADING";
  });

  return (
    <>
      <div>
        {products.length > 0 ? (
          <Card
            products={products}
            setProducts={setProducts}
            limitQ={limitQ}
            cartChange={cartChange}
            setCartChange={setCartChange}
          />
        ) : (
          <LoaderEmpty />
        )}
      </div>
    </>
  );
}
