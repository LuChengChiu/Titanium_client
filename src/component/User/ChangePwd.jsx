import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import "./ChangePwd.css";

const PWD_REGEX = /.{8,20}/;

export default function ChangePwd() {
  const { changePwd } = useAuth();
  const navigate = useNavigate();
  const [newPwd, setNewPwd] = useState("");
  const [validNewPwd, setValidNewPwd] = useState(false);
  const [newPwdFocus, setNewPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [editPwdResult, setEditPwdResult] = useState();
  useEffect(() => {
    const result = PWD_REGEX.test(newPwd);
    console.log(result, newPwd);
    setValidNewPwd(result);
    const match = newPwd === matchPwd;
    setValidMatch(match);
  }, [newPwd, matchPwd]);

  const changePwdHandler = async () => {
    try {
      const result = await changePwd(newPwd);
      setEditPwdResult(result);
      setTimeout(() => {
        navigate("/user");
      }, 3000);
    } catch (err) {
      console.log("changePwdHandler Error:", err);
    }
  };

  return (
    <>
      <section id="changePwd">
        {editPwdResult && (
          <div className="change-ring">
            <FontAwesomeIcon icon={fas.faKey} /> {editPwdResult}
          </div>
        )}
        <h1 className="title">edit password</h1>
        <div className="pwd-frame">
          <label htmlFor="pwd" className="input login-input">
            {" "}
            <input
              type="password"
              name="pwd"
              id="pwd"
              autoComplete="off"
              required
              placeholder="&nbsp;"
              onChange={(e) => {
                setNewPwd(e.target.value);
              }}
              onFocus={() => setNewPwdFocus(true)}
              onBlur={() => setNewPwdFocus(false)}
              aria-invalid={validNewPwd ? false : true}
              aria-describedby="pwdnote"
            />
            <span className="label">new password</span>
            <span className="focus-bg"></span>
          </label>
          <p
            id="pwdnote"
            className={
              newPwdFocus && !validNewPwd
                ? "instructions change-instr"
                : "offscreen"
            }
          >
            Password needs to be between 8-20 characters.
          </p>
          <label htmlFor="confirm_pwd" className="input login-input">
            <input
              type="password"
              name="confirm_pwd"
              id="confirm_pwd"
              required
              placeholder="&nbsp;"
              aria-invalid={validMatch ? false : true}
              aria-describedby="confirmnote"
              onChange={(e) => setMatchPwd(e.target.value)}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <span className="label">confirm new password</span>
            <span className="focus-bg"></span>
          </label>
          <p
            id="confirmnote"
            className={
              matchFocus && !validMatch
                ? "instructions change-instr"
                : "offscreen"
            }
          >
            Confirm password is different with the above password.
          </p>
          <button
            disabled={!validNewPwd || !validMatch}
            onClick={changePwdHandler}
            className="editPwd-btn"
          >
            update
          </button>
        </div>
      </section>
    </>
  );
}
