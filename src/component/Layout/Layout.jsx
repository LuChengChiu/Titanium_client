import React, { useEffect, useState, useContext } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import { useAuth } from "../context/AuthContext";
// import AuthContext from "../context/AuthProvider";

export default function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { sessionCheck } = useAuth();
  // const auth = useContext(AuthContext);
  useEffect(() => {
    sessionCheck().then((result) => {
      if (result?.name?.includes("Error")) {
        // console.log("Not login");
        setIsLoggedIn(false);
      } else {
        console.log("Currently Valid Login");
        setIsLoggedIn(true);
      }
    });
  }, []);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <main>
        <Outlet context={[isLoggedIn, setIsLoggedIn]} />
      </main>
      <Footer />
    </>
  );
}
