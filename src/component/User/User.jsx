import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
      console.log("log out error:", err);
      setError("Failed to log out");
    }
  };

  return (
    <>
      <section id="user">
        <h1>Profile</h1>
        <div>
          <label htmlFor="">Email: </label>
          <span>{currentUser.email}</span>
        </div>
        <button onClick={handleLogout}>Log Out</button>
      </section>
    </>
  );
}
