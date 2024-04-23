import React, { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { currentUser, token, sessionCheck } = useAuth();
  const navigate = useNavigate();
  console.log("During ProtectedRoute");
  useEffect(() => {
    if (token) {
      console.log("ProtectedRoute document.cookie: ", document.cookie);
      sessionCheck().then((checkResult) => {
        if (checkResult?.name?.includes("Error")) {
          console.log(checkResult, checkResult.name.includes("Error"));
          navigate("/login");
        } else {
          console.log(checkResult.data);
        }
      });
    }
  }, [token]);
  return currentUser ? <Outlet {...rest} /> : <Navigate to="/login" />;
}
