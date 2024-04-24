import React, { useContext, useEffect, useState } from "react";
import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import axios from "../api/axios.js";
import CryptoJS from "crypto-js";

const AuthContext = React.createContext();
const SESSION_LOGIN_URL = "/user/sessionLogin";
const SESSION_CHECK_URL = "/user/sessionCheck";
const LOGOUT_URL = "/user/logout";
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState("");
  const [csrfToken, setCSRFToken] = useState("");

  const postIdTokenToSessionLogin = async (url, idToken, csrfToken) => {
    try {
      const sessionLoginRes = await axios.post(
        url,
        { idToken, csrfToken },
        {
          headers: {
            Authorization: "Bearer " + idToken,
            XSRFToken: csrfToken,
            contentType: "application/x-www-form-urlencoded",
          },
        }
      );
      const tempServerSession = sessionLoginRes.data.sessionCookie;
      document.cookie = `serverSession=${tempServerSession}; domain=.zeabur.app; max-age=300000; secure`;
      document.cookie = `__session=${tempServerSession}; domain=.zeabur.app; max-age=300000; secure`;
      // document.cookie = `serverSession=${tempServerSession}; max-age=300000; secure`;
      // document.cookie = `__session=${tempServerSession}; max-age=300000; secure`;
      console.log(
        "tempServerSession",
        tempServerSession,
        "document.cookie",
        document.cookie
      );
      if (sessionCookie && sessionCookie !== tempServerSession) {
        sessionCookie = tempServerSession;
        console.log("1");
      } else {
        var sessionCookie = tempServerSession;
        console.log("2");
      }
      // var sessionCookie = tempServerSession;
      return sessionLoginRes;
    } catch (err) {
      console.log("postIdTokenToSessionLogin axios Error:", err);
    }
  };
  const generateCSRFToken = () => {
    const randomToken = Math.random().toString(36).substring(2);
    const secretKey = "csrfToken";
    const token = CryptoJS.enc.Base64.stringify(
      CryptoJS.HmacSHA512(randomToken, secretKey)
    );
    setCSRFToken(token);
    return csrfToken;
  };
  const signup = async (email, pwd, name) => {
    try {
      const signupRes = await createUserWithEmailAndPassword(auth, email, pwd);
      updateProfile(auth.currentUser, {
        displayName: name,
      });
      sendEmailVerification(auth.currentUser);
      return signupRes;
    } catch (err) {
      console.log("AuthContext Sign Error:", err);
    }
  };
  const login = async (email, pwd) => {
    setPersistence(auth, browserSessionPersistence);
    return signInWithEmailAndPassword(auth, email, pwd)
      .then((user) => {
        console.log(user);
        return user.user.getIdToken().then((idToken) => {
          document.cookie = `session=${idToken};max-age=3600000`;
          generateCSRFToken();
          return postIdTokenToSessionLogin(
            SESSION_LOGIN_URL,
            idToken,
            csrfToken
          );
        });
      })
      .catch((err) => {
        console.log("AuthContext login fun error:", err);
      });
  };
  const sessionCheck = async () => {
    try {
      const checkRes = await axios.get(SESSION_CHECK_URL, {
        headers: { Authorization: "Bearer " + token },
        withCredentials: true,
      });
      return checkRes;
    } catch (err) {
      logout();
      return err;
    }
  };
  const logout = async (url) => {
    await axios.get(LOGOUT_URL, {
      headers: {
        Authorization: "Bearer " + token,
        contentType: "application/x-www-form-urlencoded",
        withCredentials: true,
      },
    });
    return signOut(auth);
  };
  const resetPwd = (email) => {
    return sendPasswordResetEmail(auth, email);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user !== null) {
        const idToken = await user.getIdToken();
        setToken(idToken);
      }
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPwd,
    token,
    sessionCheck,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
