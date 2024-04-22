import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

import "./Header.css";

export default function Header({ isLoggedIn }) {
  const [darkMode, setDarkMode] = useState(false);
  /*Navbar sticky Start*/
  window.onload = function () {
    // const primaryHeader = document.querySelector(".primary-header");
    const primaryHeader = document.getElementById("header");
    const scrollWatcher = document.createElement("div");
    scrollWatcher.setAttribute("data-scroll-watcher", "");
    primaryHeader.before(scrollWatcher);
    const navObserver = new IntersectionObserver((entries) => {
      primaryHeader.classList.toggle("sticking", !entries[0].isIntersecting);
    });
    navObserver.observe(scrollWatcher);
    // console.log("working");
  };
  /*Navbar sticky End*/
  // Dark/Light mode switch
  const darkModeHandler = () => {
    var currentTheme = document.documentElement.getAttribute("data-theme");
    var targetTheme = "light";
    if (currentTheme === "light") {
      targetTheme = "dark";
    }
    document.documentElement.setAttribute("data-theme", targetTheme);
    localStorage.setItem("theme", targetTheme);
    setDarkMode(!darkMode);
  };
  var storedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  if (storedTheme)
    document.documentElement.setAttribute("data-theme", storedTheme);
  var currentTheme = document.documentElement.getAttribute("data-theme");
  // console.log(currentTheme);
  // Dark/Light mode switch
  return (
    <>
      <header id="header">
        <nav className="nav nav-main">
          <ul className="nav-interior">
            <li className="nav-item">
              <NavLink to="products">SHOP</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="sale">SALE</NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink to="saletest">NEW ARRIVAL</NavLink>
            </li> */}
          </ul>
        </nav>
        <NavLink to="/" className="logo">
          <span>TITANIUM</span>
        </NavLink>
        <nav className="nav nav-utility">
          <ul className="nav-interior">
            <li className="nav-item">
              <NavLink to={isLoggedIn ? "user" : "login"}>ACCOUNT</NavLink>
            </li>
            <li className="nav-item nav-icon">
              <NavLink to={isLoggedIn ? "cart" : "cart"}>
                {" "}
                <FontAwesomeIcon icon={fas.faBagShopping} />
              </NavLink>
            </li>
            <li className="nav-item nav-icon">
              <button
                className="mode-switch"
                onClick={() => {
                  darkModeHandler();
                }}
              >
                {!darkMode ? (
                  <FontAwesomeIcon icon={fas.faMoon} />
                ) : (
                  <FontAwesomeIcon icon={fas.faSun} />
                )}
              </button>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
