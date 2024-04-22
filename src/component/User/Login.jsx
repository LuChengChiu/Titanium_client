import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import loginImg from "/img/login-img.png";
import "./Login.css";

export default function Login() {
  const emailRef = useRef();
  const pwdRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const errRef = useRef();
  useEffect(() => {
    setError("");
  }, [emailRef, pwdRef]);
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const loginResult = await login(
        emailRef.current.value,
        pwdRef.current.value
      );
      if (loginResult) {
        navigate("/user");
      } else {
        setError("Email/Password Incorrect");
        errRef.current.focus();
      }
    } catch (err) {
      console.log("Failed to login Error:", err);
      setError(`Failed to login ${err}`);
      errRef.current.focus();
    }
    setLoading(false);
  }

  return (
    <>
      <section id="login">
        <div className="cube">
          <div className="form">
            <h2 className="title login-title">Login</h2>
            <form className="form login-form" onSubmit={handleSubmit}>
              <label htmlFor="email" className="input login-input">
                {" "}
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="off"
                  required
                  placeholder="&nbsp;"
                  ref={emailRef}
                />
                <span className="label">Email</span>
                <span className="focus-bg"></span>
              </label>
              <label htmlFor="pwd" className="input login-input">
                <input
                  type="password"
                  name="pwd"
                  id="pwd"
                  ref={pwdRef}
                  required
                  placeholder="&nbsp;"
                />
                <span className="label">Password</span>
                <span className="focus-bg"></span>
              </label>
              <p
                ref={errRef}
                className={error ? "errmsg" : "offscreen"}
                aria-live="assertive"
              >
                {error}
              </p>
              <NavLink to="/forgetPassword" className="forget-pwd">
                Forget Password ?
              </NavLink>
              <button type="submit" disabled={loading} className="form-btn">
                Login
              </button>
            </form>{" "}
            <span className="form-other">
              Haven't join us? <NavLink to="/register">Register</NavLink>
            </span>
          </div>
          <img className="login-img" src={loginImg} alt="" />
        </div>
      </section>
    </>
  );
}
