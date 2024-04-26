import { useRef, useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import regImg from "/img/reg-img.png";
import regVideo from "/reg_animation.mp4";
import { useAuth } from "../context/AuthContext";
import "./Register.css";
const REGISTER_URL = "/user/register";
const EMAIL_REGEX = /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$/;
const PWD_REGEX = /.{8,20}/;
const CELL_REGEX = /[0]{1}[9]{1}[0-9]{8}/;
const NAME_REGEX = /.{3,}/;

export default function Register() {
  const errRef = useRef();
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [cell, setCell] = useState("");
  const [validCell, setValidCell] = useState(false);
  const [cellFocus, setCellFocus] = useState(false);

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);
  const [bday, setBday] = useState("");
  const [bdayFocus, setBdayFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const result = EMAIL_REGEX.test(email);
    console.log(result, email);
    setValidEmail(result);
  }, [email]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result, pwd);
    setValidPwd(result);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);

  useEffect(() => {
    const result = CELL_REGEX.test(cell);
    console.log(result, cell);
    setValidCell(result);
  }, [cell]);

  useEffect(() => {
    const result = NAME_REGEX.test(name);
    console.log(result, name);
    setValidName(result);
  }, [name]);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd, matchPwd, cell, name]);
  const navigate = useNavigate();
  const { signup, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1 = EMAIL_REGEX.test(email);
    const v2 = PWD_REGEX.test(pwd);
    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const signupatFirebase = await signup(email, pwd, name);
      console.log(signupatFirebase.user.uid);
      if (signupatFirebase) {
        const user_id = signupatFirebase.user.uid;
        const response = await axios.post(
          REGISTER_URL,
          {
            user_id,
            email,
            pwd,
            cell,
            name,
            bday,
          },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        console.log("b4 login firebase session", response);
        const loginFirebaseRes = await login(email, pwd);
        console.log("loginFirebaseRes", loginFirebaseRes);
        setSuccess(true);
        setEmail("");
        setPwd("");
        setMatchPwd("");
        setName("");
        setBday("");
        setCell("");
        navigate("/user");
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 409) {
        console.log(err.response?.data?.message);
        setErrMsg(err.response?.data?.message);
      } else {
        setErrMsg("Registeration Failed");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      <section id="register">
        <div className="cube">
          <div className="video-frame">
            <video autoPlay muted loop>
              <source src={regVideo} type="video/mp4" autoplay />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="form">
            <h2 className="title register-title">Register</h2>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
            <form className="form register-form" onSubmit={handleSubmit}>
              <label htmlFor="email" className="input register-input">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="off"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-invalid={validEmail ? false : true}
                  aria-describedby="uidnote"
                  onFocus={() => setEmailFocus(true)}
                  onBlur={() => {
                    setEmailFocus(false);
                  }}
                  placeholder="&nbsp;"
                />
                <span className=" label register-label">Email</span>
                <span className="focus-bg"></span>{" "}
                <span className={validEmail ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={fas.faCircleCheck} />
                </span>
                <span className={validEmail || !email ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={fas.faCircleXmark} />
                </span>
              </label>{" "}
              <p
                id="uidnote"
                className={
                  emailFocus && email && !validEmail
                    ? "instructions"
                    : "offscreen"
                }
              >
                Please fill in a valid Email account.
              </p>
              <label htmlFor="pwd" className="input register-input">
                {" "}
                <input
                  type="password"
                  name="pwd"
                  id="pwd"
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  aria-invalid={validPwd ? false : true}
                  aria-describedby="pwdnote"
                  onFocus={() => setPwdFocus(true)}
                  onBlur={() => {
                    setPwdFocus(false);
                  }}
                  placeholder="&nbsp;"
                />
                <span className="label register-label">Password</span>
                <span className="focus-bg"></span>
                <span className={validPwd ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={fas.faCircleCheck} />
                </span>
                <span className={validPwd || !pwd ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={fas.faCircleXmark} />
                </span>
              </label>
              <p
                id="pwdnote"
                className={
                  pwdFocus && !validPwd
                    ? "instructions smaller-instruction"
                    : "offscreen smaller-instruction"
                }
              >
                Password needs to be between 8-20 characters.
              </p>
              <label htmlFor="confirm_pwd" className="input register-input">
                <input
                  type="password"
                  name="confirm_pwd"
                  id="confirm_pwd"
                  onChange={(e) => setMatchPwd(e.target.value)}
                  required
                  aria-invalid={validMatch ? false : true}
                  aria-describedby="confirmnote"
                  onFocus={() => setMatchFocus(true)}
                  onBlur={() => {
                    setMatchFocus(false);
                  }}
                  placeholder="&nbsp;"
                />
                <span className="label register-label">Confirm Password</span>
                <span className="focus-bg"></span>
                <span className={validMatch && matchPwd ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={fas.faCircleCheck} />
                </span>
                <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={fas.faCircleXmark} />
                </span>
              </label>
              <p
                id="confirmnote"
                className={
                  matchFocus && !validMatch
                    ? "instructions smaller-instruction"
                    : "offscreen smaller-instruction"
                }
              >
                Confirm password is different with the above password.
              </p>
              <label htmlFor="name" className="input register-input">
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  aria-invalid={!name ? false : true}
                  aria-describedby="namenote"
                  onFocus={() => setNameFocus(true)}
                  onBlur={() => {
                    setNameFocus(false);
                  }}
                  placeholder="&nbsp;"
                />{" "}
                <span className="label register-label">Username</span>
                <span className="focus-bg"></span>
                <span className={validName && name ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={fas.faCircleCheck} />
                </span>
                <span className={validName || !name ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={fas.faCircleXmark} />
                </span>
              </label>
              <p
                id="namenote"
                className={nameFocus && !name ? "instructions" : "offscreen"}
              >
                Username can't be blank.
              </p>
              <div className="small-label-sec">
                <label htmlFor="cell" className="input register-input">
                  {" "}
                  <input
                    type="text"
                    name="cell"
                    id="cell"
                    onChange={(e) => setCell(e.target.value)}
                    required
                    aria-invalid={validCell ? false : true}
                    aria-describedby="cellnote"
                    onFocus={() => setCellFocus(true)}
                    onBlur={() => {
                      setCellFocus(false);
                    }}
                    placeholder="&nbsp;"
                  />{" "}
                  <span className="label register-label">Cellphone</span>
                  <span className="focus-bg"></span>
                  <span className={validCell ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={fas.faCircleCheck} />
                  </span>
                  <span className={validCell || !cell ? "hide" : "invalid"}>
                    <FontAwesomeIcon icon={fas.faCircleXmark} />
                  </span>
                </label>

                <label htmlFor="bday" className="input register-input">
                  <input
                    type="date"
                    name="bday"
                    id="bday"
                    onChange={(e) => setBday(e.target.value)}
                    required
                    aria-invalid={!bday ? false : true}
                    aria-describedby="bdaynote"
                    onFocus={() => setBdayFocus(true)}
                    onBlur={() => {
                      setBdayFocus(false);
                    }}
                    placeholder="&nbsp;"
                  />{" "}
                  <span className="label register-label">Birthday</span>
                  <span className="focus-bg"></span>{" "}
                  <span className={bday ? "valid" : "hide"}>
                    <FontAwesomeIcon icon={fas.faCircleCheck} />
                  </span>
                </label>
                <p
                  id="cellnote"
                  className={
                    cellFocus && !validCell
                      ? "smaller-instruction instructions"
                      : "smaller-instruction offscreen"
                  }
                >
                  Incorrect format.
                </p>
                <p
                  id="bdaynote"
                  className={
                    bdayFocus && !bday
                      ? "smaller-instruction instructions"
                      : "smaller-instruction offscreen"
                  }
                >
                  Birthday can't be blank.
                </p>
              </div>
              <button
                disabled={
                  !validEmail ||
                  !validPwd ||
                  !validMatch ||
                  !validCell ||
                  !name ||
                  !bday
                    ? true
                    : false
                }
                className="form-btn register-btn"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
