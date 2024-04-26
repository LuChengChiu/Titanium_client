import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../api/axios";
import "./Profile.css";

const USER = "/user";

export default function Profile() {
  const { currentUser } = useAuth();
  const [userInfo, setUserInfo] = useState();
  useEffect(() => {
    getUserInfo();
  }, []);
  const getUserInfo = async () => {
    try {
      const userId = currentUser.uid;
      const userRes = await axios.post(USER, { userId });
      setUserInfo(userRes.data[0]);
    } catch (err) {
      console.log("getUserInfo Error:", err);
    }
  };
  console.log("userInfo", userInfo);
  return (
    <>
      <section id="profile">
        <h1 className="user-title">Profile</h1>

        <table className="info-table">
          <tr>
            <th>name</th>
            <td>{userInfo?.username}WHY</td>
          </tr>
          <tr>
            <th>email</th>
            <td>{userInfo?.email}</td>
          </tr>
          <tr>
            <th>phone</th>
            <td>{userInfo?.phone}</td>
          </tr>
          <tr>
            <th>password</th>
            <td>************</td>
            <td style={{ padding: "0em", width: "3em" }}>
              <NavLink to="changePassword">Edit</NavLink>
            </td>
          </tr>
          <tr>
            <th>birthday</th>
            <td>{userInfo?.birthday.split("T")[0]}</td>
          </tr>
        </table>
      </section>
    </>
  );
}
