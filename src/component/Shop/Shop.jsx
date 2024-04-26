import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { NavLink } from "react-router-dom";
import noProduct from "/img/noProduct.svg";
import Loading from "../Layout/Loading/Loading";
import "./Shop.css";

const PRODUCTS_URL = "/products";
const PRODUCT_INFO_URL = "/products/info";

const ProductCards = ({ productList, filteredList, isLoading }) => {
  if (filteredList && isLoading != true) {
    if (filteredList.length > 0) {
      return (
        <>
          <div className="product-card-zone">
            {filteredList.map((product, index) => {
              return (
                <>
                  <NavLink key={index} to={`/products/${product.product_id}`}>
                    <div className="product-card">
                      <div className="img-frame">
                        <img
                          className="card-img"
                          src={product.images[0]}
                          alt={product.name}
                        />
                      </div>
                      <div className="product-card-info">
                        <h6>{product.name}</h6>
                        <div className="price-tags">
                          <span
                            className={
                              product.sale == null ? "price" : "price onSale"
                            }
                          >
                            $ {product.price.toLocaleString()}
                          </span>
                          {product.sale !== null ? (
                            <span className="price price-sale">
                              $ {product.sale.toLocaleString()}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>{" "}
                  </NavLink>
                </>
              );
            })}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="no-product">
            <span className="no-product-title">
              oops! there's no product here!
            </span>
            <img className="no-product-img" src={noProduct} alt="" />
          </div>
        </>
      );
    }
  } else if (productList && isLoading != true) {
    return (
      <>
        <div className="product-card-zone">
          {productList.map((product, index) => {
            return (
              <>
                <NavLink key={index} to={`/products/${product.product_id}`}>
                  <div className="product-card">
                    <div className="img-frame">
                      <img
                        className="card-img"
                        src={product.images[0]}
                        alt={product.name}
                      />
                    </div>
                    <div className="product-card-info">
                      <h6>{product.name}</h6>
                      <div className="price-tags">
                        <span
                          className={
                            product.sale == null ? "price" : "price onSale"
                          }
                        >
                          $ {product.price.toLocaleString()}
                        </span>
                        {product.sale !== null ? (
                          <span className="price price-sale">
                            $ {product.sale.toLocaleString()}
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>{" "}
                </NavLink>
              </>
            );
          })}{" "}
        </div>
      </>
    );
  } else {
    return (
      <>
        <Loading />
      </>
    );
  }
};

export default function Shop({ salePage, collection }) {
  const [productList, setProductList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState({
    collections: "allbrand",
    category: "",
    price: "allprice",
  });
  const [sort, setSort] = useState("oldFirst");
  const [isLoading, setIsLoading] = useState(true);
  // get product data from backend
  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    if (productList.length != 0) {
      setIsLoading(false);
    }
    if (salePage) {
      setSelectedFilter({ ...selectedFilter, price: salePage });
    }
    if (collection) {
      setSelectedFilter({ ...selectedFilter, collections: collection });
    }
  }, [productList]);
  const getProducts = async () => {
    const imgCloud = await axios.get(PRODUCTS_URL).then((response) => {
      return response.data;
    });
    const productInfo = await axios.get(PRODUCT_INFO_URL).then((response) => {
      return response.data;
    });
    const sortedImgCloud = imgCloud
      .map((item) => {
        const number = parseInt(item.public_id.match(/zippo(\d+)/)[1]);
        return { ...item, public_id: number };
      })
      .sort((a, b) => a.public_id - b.public_id);
    var index = 0;
    for (let i = 0; i < productInfo.length; i++) {
      let imgAmount = sortedImgCloud.filter((item) => {
        let match = item.public_id;
        return match === i + 1;
      }).length;
      let images = [];
      for (let j = 1; j <= imgAmount; j++) {
        images.push(sortedImgCloud[index].secure_url);
        index += 1;
      }
      productInfo[i].images = images;
      productInfo[i].key = i + 1;
    }
    setProductList(productInfo);
    setFilteredList(productInfo);
  };
  // Get product data from backend
  // Sidebar
  const collections = [
    { id: "allbrand", text: "all" },
    { id: "zippo", text: `zippo` },
    { id: "accessory", text: `accessory` },
  ];
  const category = [
    { id: "zippo", text: "all" },
    { id: "special", text: "特別設計款" },
    { id: "80", text: "80 週年紀念款" },
    { id: "classic", text: "經典素面款式" },
    { id: "replacement", text: "配件" },
  ];
  const price = [
    { id: "allprice", text: "all" },
    { id: "sale", text: "sale" },
    { id: "below1000", text: `below $1000` },
    { id: "1000to2000", text: `$1001 - $2000` },
    { id: "2000to3000", text: `$2001 - $3000` },
    { id: "3000to4000", text: `$3001 - $4000` },
    { id: "above4000", text: `above $4001` },
  ];
  // Sidebar
  // Filter Handle
  const filterHandler = (e) => {
    setSelectedFilter({ ...selectedFilter, [e.target.name]: e.target.id });
  };
  // Filter Handle
  // filter product list
  useEffect(() => {
    // console.log(productList);
    // console.log(selectedFilter);
    if (productList) {
      let filter = productList;
      if (selectedFilter.collections !== "allbrand") {
        filter = productList.filter((product) => {
          return product.category == selectedFilter.collections;
        });
      }
      if (selectedFilter.category !== "") {
        if (selectedFilter.category !== "catzippo") {
          filter = filter.filter((product) => {
            return product.theme == selectedFilter.category;
          });
        }
      }
      if (selectedFilter.price !== "allprice") {
        if (
          selectedFilter.price.includes("below") ||
          selectedFilter.price.includes("above")
        ) {
          if (selectedFilter.price.includes("below")) {
            filter = filter.filter((product) => {
              return (
                product.price <= parseInt(selectedFilter.price.substring(5))
              );
            });
          } else {
            filter = filter.filter((product) => {
              return (
                product.price > parseInt(selectedFilter.price.substring(5))
              );
            });
          }
          // console.log("current price filter", selectedFilter.price);
        } else if (selectedFilter.price == "sale") {
          filter = filter.filter((product) => {
            return product.sale !== null;
          });
        } else {
          filter = filter.filter((product) => {
            return (
              product.price > parseInt(selectedFilter.price.substring(0, 4)) &&
              product.price < parseInt(selectedFilter.price.substring(6))
            );
          });
        }
      }
      setFilteredList(filter);
    }
  }, [selectedFilter]);
  // filter product list
  // Order/Sort of products
  const orders = [
    { id: "newFirst", text: "New to Old" },
    { id: "oldFirst", text: "Old to New" },
    { id: "priceHighFirst", text: "Price: High to Low" },
    { id: "priceLowFirst", text: "Price: Low to High" },
  ];
  const orderHandler = (e) => {
    setSort(e.target.id);
  };
  const changeOrder = (orderList) => {
    if (sort == orders[0].id) {
      orderList.sort((a, b) => b.product_id - a.product_id);
      // console.log(" new first", orderList);
    } else if (sort == orders[1].id) {
      orderList.sort((a, b) => a.product_id - b.product_id);
      // console.log("old first", orderList);
    } else if (sort.includes("price")) {
      if (sort.substring(5, 9) == "High") {
        orderList = orderList.sort((a, b) => b.price - a.price);
        // console.log("price high 1st", orderList);
      } else {
        orderList.sort((a, b) => a.price - b.price);
        // console.log("price low first", orderList);
      }
    }
    return orderList;
  };
  useEffect(() => {
    if (filteredList) {
      let orderList = [...filteredList];
      setFilteredList(changeOrder(orderList));
    } else if (productList) {
      let orderList = [...productList];
      setFilteredList(changeOrder(orderList));
    }
  }, [sort]);
  // Order of products
  return (
    <>
      <section id="shop">
        <div className="sidebar">
          <div className="sidebar-zone">
            <h5 className="sidebar-title">collection</h5>
            {collection
              ? collections.map((item) => {
                  return (
                    <>
                      {item.id == collection ? (
                        <label
                          className="sidebar-label-container"
                          htmlFor={item.id}
                          key={item.id}
                        >
                          <input
                            type="radio"
                            name="collections"
                            id={item.id}
                            defaultChecked={true}
                            onChange={(e) => {
                              filterHandler(e);
                            }}
                          />
                          <span className="label-text">{item.text}</span>
                        </label>
                      ) : (
                        <label
                          className="sidebar-label-container"
                          htmlFor={item.id}
                          key={item.id}
                        >
                          <input
                            type="radio"
                            name="collections"
                            id={item.id}
                            onChange={(e) => {
                              filterHandler(e);
                            }}
                          />
                          <span className="label-text">{item.text}</span>
                        </label>
                      )}
                    </>
                  );
                })
              : collections.map((item) => {
                  return (
                    <>
                      {item.id == "allbrand" ? (
                        <label
                          className="sidebar-label-container"
                          htmlFor={item.id}
                          key={item.id}
                        >
                          <input
                            type="radio"
                            name="collections"
                            id={item.id}
                            defaultChecked={true}
                            onChange={(e) => {
                              filterHandler(e);
                            }}
                          />
                          <span className="label-text">{item.text}</span>
                        </label>
                      ) : (
                        <label
                          className="sidebar-label-container"
                          htmlFor={item.id}
                          key={item.id}
                        >
                          <input
                            type="radio"
                            name="collections"
                            id={item.id}
                            onChange={(e) => {
                              filterHandler(e);
                            }}
                          />
                          <span className="label-text">{item.text}</span>
                        </label>
                      )}
                    </>
                  );
                })}
          </div>
          <div className="sidebar-zone">
            <h5 className="sidebar-title">category</h5>
            <h6 className="sidebar-subtitle">zippo</h6>
            {category.map((item) => {
              return (
                <>
                  {item.id == category[0].id ? (
                    <label
                      className="sidebar-label-container"
                      htmlFor={"cat" + item.id}
                      key={item.id}
                    >
                      <input
                        type="radio"
                        name="category"
                        id={"cat" + item.id}
                        onChange={(e) => {
                          filterHandler(e);
                        }}
                      />
                      <span className="label-text">{item.text}</span>
                    </label>
                  ) : (
                    <label
                      className="sidebar-label-container"
                      htmlFor={item.id}
                      key={item.id}
                    >
                      <input
                        type="radio"
                        name="category"
                        id={item.id}
                        onChange={(e) => {
                          filterHandler(e);
                        }}
                      />
                      <span className="label-text">{item.text}</span>
                    </label>
                  )}
                </>
              );
            })}
            <h6 className="sidebar-subtitle">accs</h6>
            <span
              style={{
                textTransform: "capitalize",
                alignSelf: "center",
                marginRight: "3em",
              }}
            >
              comming soon
            </span>
          </div>
          <div className="sidebar-zone">
            <h5 className="sidebar-title">price</h5>
            {salePage
              ? price.map((item) => {
                  return (
                    <>
                      {item.id == salePage ? (
                        <label
                          className="sidebar-label-container"
                          htmlFor={item.id}
                          key={item.id}
                        >
                          <input
                            type="radio"
                            name="price"
                            id={item.id}
                            defaultChecked={true}
                            onChange={(e) => {
                              filterHandler(e);
                            }}
                          />
                          <span className="label-text">{item.text}</span>
                        </label>
                      ) : (
                        <label
                          className="sidebar-label-container"
                          htmlFor={item.id}
                          key={item.id}
                        >
                          <input
                            type="radio"
                            name="price"
                            id={item.id}
                            onChange={(e) => {
                              filterHandler(e);
                            }}
                          />
                          <span className="label-text">{item.text}</span>
                        </label>
                      )}
                    </>
                  );
                })
              : price.map((item) => {
                  return (
                    <>
                      {item.id == selectedFilter.price ? (
                        <label
                          className="sidebar-label-container"
                          htmlFor={item.id}
                          key={item.id}
                        >
                          <input
                            type="radio"
                            name="price"
                            id={item.id}
                            defaultChecked={true}
                            onChange={(e) => {
                              filterHandler(e);
                            }}
                          />
                          <span className="label-text">{item.text}</span>
                        </label>
                      ) : (
                        <label
                          className="sidebar-label-container"
                          htmlFor={item.id}
                          key={item.id}
                        >
                          <input
                            type="radio"
                            name="price"
                            id={item.id}
                            onChange={(e) => {
                              filterHandler(e);
                            }}
                          />
                          <span className="label-text">{item.text}</span>
                        </label>
                      )}
                    </>
                  );
                })}
          </div>
        </div>
        <ul className="select">
          <li>
            <input
              className="select-close"
              type="radio"
              id="close"
              name="order"
            />
            <span className="select-label select-placeholder">Sort by</span>
          </li>
          <li className="select-items">
            <input
              type="radio"
              id="open"
              name="order"
              className="select-expand"
            />
            <label className="select-close-label" htmlFor="close" />
            <ul className="select-options">
              {orders.map((order) => {
                return (
                  <li className="select-opt" key={order.id}>
                    <input
                      type="radio"
                      id={order.id}
                      name="order"
                      className="select-input"
                      onChange={orderHandler}
                    />
                    <label htmlFor={order.id} className="select-label">
                      {order.text}
                    </label>
                  </li>
                );
              })}
            </ul>
            <label className="select-expand-label" htmlFor="open"></label>
          </li>
        </ul>
        <ProductCards
          productList={productList}
          filteredList={filteredList}
          isLoading={isLoading}
        />
      </section>
    </>
  );
}
