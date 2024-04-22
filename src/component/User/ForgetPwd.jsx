import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./ForgetPwd.css";
export default function ForgetPwd() {
  const emailRef = useRef();
  const { resetPwd } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      console.log(emailRef.current.value);
      await resetPwd(emailRef.current.value);
      setMessage("Check your email inbox for further instructions!");
    } catch (err) {
      setError("Failed in Reset Password");
    }
    setLoading(false);
  }
  return (
    <>
      <section id="forget-pwd">
        <div className="forget-pwd-cube">
          <h2 className="forget-title">Forget Password</h2>
          <span className="forget-span">{message && <p>{message}</p>}</span>
          <span className="forget-span"> {error && <p>{error}</p>}</span>

          <form className="form forget-form" onSubmit={handleSubmit}>
            <label htmlFor="email" className="input forget-label">
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="&nbsp;"
                className="forget-input"
                ref={emailRef}
              />
              <span className="forget-show-label">Email</span>
              <span className="focus-bg"></span>
            </label>
            <button type="submit" disabled={loading} className="forget-btn">
              Submit
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
