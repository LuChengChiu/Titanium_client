import React, { useState, useRef } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "./User.css";
export default function Profile() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  //   console.log(currentUser);
  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/");
    } catch (err) {
      setError("Failed to log out");
    }
  };

  return (
    <>
      <section id="user">
        <div className="user-side">
          <span className="side-title">titanium</span>
          <ul>
            <li className="side-list">
              <NavLink to="/user" className="side-link" end>
                <FontAwesomeIcon className="link-icon" icon={fas.faUser} />{" "}
                profile
              </NavLink>
            </li>
            <li className="side-list">
              <NavLink to="orders" className="side-link">
                <FontAwesomeIcon
                  className="link-icon"
                  icon={fas.faClipboardList}
                />{" "}
                orders
              </NavLink>
            </li>
            <li className="side-list">
              <NavLink to="wishlist" className="side-link">
                <FontAwesomeIcon className="link-icon" icon={fas.faBookmark} />{" "}
                wishlist
              </NavLink>
            </li>
          </ul>{" "}
          <button className="btn-logout" onClick={handleLogout}>
            Log Out
          </button>{" "}
        </div>
        <div className="user-main">
          <Outlet />
        </div>
      </section>
    </>
  );
}
