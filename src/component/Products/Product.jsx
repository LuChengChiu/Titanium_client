import React, { useEffect, useState, useContext, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  useParams,
  useOutletContext,
  useNavigate,
  NavLink,
} from "react-router-dom";
import axios from "../api/axios";
// import AuthContext from "../context/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "./Product.css";

const PRODUCT_ID_URL = "/products/id";
const WISHLISTCHECK_URL = "/wishlist/check";
const WISHLISTCHANGE_URL = "/wishlist/change";
const ADDTOCART_URL = "/cart/add";

export default function Product2() {
  const [productId, setProductId] = useState(null);
  const [theProduct, setTheProduct] = useState(null);
  const [mainImg, setMainImg] = useState(null);
  const [productQ, setProductQ] = useState(1);
  const { sessionCheck, currentUser } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [wishlist, setWishList] = useState(false);
  const [addCartSuccess, setAddCartSuccess] = useState(null);

  const navigate = useNavigate();
  // Get product info
  const params = useParams();
  let id = params.id;
  useEffect(() => {
    setProductId(id);
    getTheProduct();
    setUserId(currentUser?.uid);
    sessionCheck().then((result) => {
      if (result?.name?.includes("Error")) {
        console.log("Not login");
        setIsLoggedIn(false);
      } else {
        console.log("Currently Valid Login");
        setIsLoggedIn(true);
      }
    });
    console.log("user", currentUser);
  }, []);
  const getTheProduct = async () => {
    const theProductRes = await axios
      .post(PRODUCT_ID_URL, { id })
      .then((response) => {
        return response.data;
      });
    // console.log(theProductRes);
    setTheProduct(theProductRes);
  };
  // Get product info
  // Select Main img
  useEffect(() => {
    if (theProduct?.imgs.length > 0) {
      setMainImg(theProduct?.imgs[0]);
    }
    checkWishlist();
  }, [theProduct]);
  const selectImg = (e) => {
    setMainImg(e.target.id);
  };
  // Select Main img
  // Product Q
  const limitQ = 10;
  const qChange = (e) => {
    if (e.target.value < limitQ && e.target.value > 0) {
      setProductQ(e.target.value);
    } else if (e.target.value == 0) {
      setProductQ(1);
    } else {
      setProductQ(limitQ);
    }
  };
  // Product Q
  // WishList
  const checkWishlist = async () => {
    if (isLoggedIn) {
      if (userId) {
        try {
          const checkWishlistRes = await axios.post(
            WISHLISTCHECK_URL,
            { userId, productId },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          let inWishlist = checkWishlistRes.data.inWishlist;
          if (inWishlist) {
            setWishList(true);
          }
        } catch (err) {
          console.log("Wishlist Handler Error:", err);
        }
      }
    } else {
      setWishList(false);
    }
  };
  const wishlistHandler = async () => {
    if (isLoggedIn && userId) {
      if (wishlist) {
        try {
          const addWishlistRes = await axios.post(
            WISHLISTCHANGE_URL,
            { productId, userId, wishlist },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          console.log("addWishlistRes:", addWishlistRes);
        } catch (err) {
          console.log("Remove from wishlist Error:", err);
        }
      } else {
        try {
          const removeWishlistRes = await axios.post(
            WISHLISTCHANGE_URL,
            { productId, userId, wishlist },
            {
              headers: { "Content-Type": "application/json" },
              withCredentials: true,
            }
          );
          console.log("removeWishlistRes", removeWishlistRes);
        } catch (err) {
          console.log("Add to wishlist Error:", err);
        }
      }
    } else {
      navigate("/login");
    }
  };
  // WishList
  // Buy
  const addToCart = async (e) => {
    console.log("hi", productQ);
    console.log(e.target.value);
    console.log("b4", addCartSuccess);
    if (userId) {
      try {
        const addCartRes = await axios.post(
          ADDTOCART_URL,
          { userId, productId, productQ },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log("addCart res:", addCartRes);
        if (addCartRes.data.cart) {
          setAddCartSuccess(true);
        }
        if (e.target.value == "buy") {
          navigate("/cart");
        }
      } catch (err) {
        console.log("addToCart Error:", err);
      }
    } else {
      navigate("/login");
    }
  };
  useEffect(() => {
    if (addCartSuccess) {
      setTimeout(() => {
        setAddCartSuccess(false);
      }, 3990);
    }
  }, [addCartSuccess]);
  // Buy
  // useEffect(() => {
  //   console.log(`Quantity: ${productQ}`);
  // }, [productQ]);
  return (
    <section id="product">
      {addCartSuccess ? (
        <div className="add-cart-success">
          {" "}
          <FontAwesomeIcon
            icon={fas.faBell}
            style={{ color: "#555ae6" }}
          />{" "}
          商品已加入購物車 !
        </div>
      ) : (
        ""
      )}
      <div className="side-product side-product-left">HI</div>
      <div className="main-product">
        <div className="section-img">
          <img className="img-main" src={mainImg?.secure_url} alt="" />
          <div className="imgs-frame">
            {theProduct?.imgs.map((img) => {
              return (
                <>
                  <label
                    htmlFor={img.public_id}
                    className="img-label"
                    key={img.public_id}
                  >
                    <input
                      className="img-input"
                      type="radio"
                      name="img"
                      id={img.public_id}
                      onChange={selectImg}
                    />
                    <img className="img-side" src={img.secure_url} alt="" />
                  </label>
                </>
              );
            })}{" "}
            {theProduct?.imgs.map((img) => {
              return (
                <>
                  <label
                    htmlFor={img.public_id}
                    className="img-label"
                    key={img.public_id}
                  >
                    <input
                      className="img-input"
                      type="radio"
                      name="img"
                      id={img.public_id}
                      onChange={selectImg}
                    />
                    <img className="img-side" src={img.secure_url} alt="" />
                  </label>
                </>
              );
            })}{" "}
          </div>
        </div>
        <div className="section-info">
          <span className="brand-name">{theProduct?.info.brand}</span>
          <h2 className="product-name">{theProduct?.info.name}</h2>
          <div className="price-zone">
            <span
              className={
                theProduct?.info.sale == null
                  ? "product-price"
                  : "product-price product-onSale"
              }
            >
              $ {theProduct?.info.price.toLocaleString()}
            </span>
            {theProduct?.info.sale !== null ? (
              <span className="product-price product-sale">
                $ {theProduct?.info.sale.toLocaleString()}
              </span>
            ) : (
              ""
            )}
          </div>
          <label htmlFor="wishlist" className="wishlist-check">
            <input
              type="checkbox"
              id="wishlist"
              onClick={() => {
                setWishList(!wishlist);
                wishlistHandler();
              }}
            />
            <span>
              {wishlist ? (
                <FontAwesomeIcon icon={fas.faHeart} />
              ) : (
                <FontAwesomeIcon icon={far.faHeart} />
              )}
            </span>
          </label>
          {theProduct?.info?.size ? (
            <select name="size" id="product-size">
              <option value="">size</option>
              <option value="s">- s -</option>
              <option value="m">- m -</option>
              <option value="l">- l -</option>
            </select>
          ) : (
            ""
          )}
          <div className="product-number">
            <button
              className="product-number-btn"
              onClick={() => {
                if (productQ > 1) {
                  setProductQ(productQ - 1);
                }
              }}
            >
              <FontAwesomeIcon icon={fas.faMinus} />
            </button>
            <input
              id="product-number"
              type="number"
              onChange={(e) => {
                qChange(e);
              }}
              min="1"
              max="10"
              value={productQ}
              className="input-q"
            />
            <button
              className="product-number-btn"
              onClick={() => {
                if (productQ < limitQ) {
                  setProductQ(productQ + 1);
                }
              }}
            >
              <FontAwesomeIcon icon={fas.faPlus} />
            </button>
          </div>
          <div className="ex-info">
            <input type="checkbox" id="moreinfo" />
            <label htmlFor="moreinfo" className="ex-info-label">
              view detail
            </label>
            <ul className="ex-info-list">
              <li>
                產地: <span>{theProduct?.info.origin}</span>
              </li>
              <li>
                材質: <span>{theProduct?.info.material}</span>
              </li>
            </ul>
          </div>
        </div>
        <button
          className="cta-btn btn-left"
          onClick={(e) => {
            addToCart(e);
          }}
          value="cart"
        >
          add to cart
        </button>
        <button
          className="cta-btn btn-right"
          onClick={(e) => {
            addToCart(e);
          }}
          value="buy"
        >
          buy now
        </button>
      </div>
      <div className="side-product side-product-right">HI</div>
    </section>
  );
}
