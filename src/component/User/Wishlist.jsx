import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import Loading from "../Layout/Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "./Wishlist.css";

const WISHLIST_URL = "/wishlist";
const WISHLIST_CHANGE_URL = "/wishlist/change";
const PRODUCT_IDS_URL = "/products/ids";

const LoaderEmpty = () => {
  const [load, setLoad] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoad(false);
    }, 2000);
  }, []);
  const EmptyList = () => {
    return (
      <div className="empty-wish">
        <h2 className="empty-wish-title">there's nothing in your wishlist.</h2>
        <p>Why not make it full?</p>{" "}
        <NavLink to="/products" className="empty-link">
          Let's Add Something...
        </NavLink>
      </div>
    );
  };
  return <>{load ? <Loading /> : <EmptyList />}</>;
};

export default function Wishlist() {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState();
  const [productList, setProductList] = useState();
  useEffect(() => {
    getWishlist();
  }, []);
  useEffect(() => {
    if (wishlist) {
      getProduct();
    }
  }, [wishlist]);
  const getWishlist = async () => {
    try {
      const userId = currentUser.uid;
      const wishlistRes = await axios.post(WISHLIST_URL, { userId });
      setWishlist(wishlistRes.data);
    } catch (err) {
      console.log("getWishlist Error:", err);
    }
  };
  const getProduct = async () => {
    try {
      const ids = wishlist.map((item) => {
        return item.product_id;
      });
      const items = await axios.post(PRODUCT_IDS_URL, { ids });
      const products = items?.data.info.map((product) => {
        const productId = product.product_id;
        const name = product.name;
        const imgList = items?.data.imgs
          .map((sublist) => sublist[0])
          .find((u) => {
            return u.public_id.includes(`TITANIUM img/zippo${productId}_`);
          });
        return { productId, name, url: imgList.secure_url };
      });
      setProductList(products);
    } catch (err) {
      console.log("getProduct Error:", err);
    }
  };
  const removeFromWishlist = async (e) => {
    console.log(e.target.id);
    try {
      const userId = currentUser.uid;
      const productId = e.target.id;
      const wishlist = true;
      const removeRes = await axios.post(WISHLIST_CHANGE_URL, {
        userId,
        productId,
        wishlist,
      });
      // console.log(removeRes);
      if (removeRes.data) {
        const removeElement = document.getElementById(`card-${e.target.id}`);
        removeElement.remove();
      }
    } catch (err) {
      console.log("removeFromWishlist Error:", err);
    }
  };
  return (
    <>
      <section id="wishlist">
        <h1 className="user-title">Wishlist</h1>
        {productList && productList.length > 0 ? (
          <div className="wishlist-cards">
            {productList.map((prod, index) => {
              return (
                <div
                  className="card-frame"
                  key={index}
                  id={`card-${prod.productId}`}
                >
                  <NavLink to={`/products/${prod.productId}`}>
                    <div className="wish-card">
                      <img
                        className="wish-card-img"
                        src={prod.url}
                        alt={`img of ${prod.name}`}
                      />
                      <span className="wish-card-text">{prod.name}</span>
                    </div>
                  </NavLink>
                  <button className="wish-heart" onClick={removeFromWishlist}>
                    <div className="heart" id={prod.productId} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <LoaderEmpty />
        )}
      </section>
    </>
  );
}
