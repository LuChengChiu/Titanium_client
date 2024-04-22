import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fab } from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

export default function Footer() {
  return (
    <>
      <section id="footer">
        <span className="footer-logo" data-text="TITANIUM">
          <NavLink className="footer-link" to="/">
            TITANIUM
          </NavLink>
        </span>

        <div className="footer-rht">
          <ul>
            <li className="footer-title">customer service</li>
            <li>
              <NavLink className="footer-link" to="#">
                instructions
              </NavLink>
            </li>
            <li>
              {" "}
              <NavLink className="footer-link" to="#">
                FAQ
              </NavLink>
            </li>
          </ul>

          <ul>
            <li className="footer-title">contact us</li>
            <li>
              <NavLink
                className="footer-link"
                to="https://www.facebook.com/profile.php?id=100076443393196"
                target="_blank"
              >
                <FontAwesomeIcon
                  className="footer-icon"
                  icon={fab.faSquareFacebook}
                />
              </NavLink>{" "}
              <NavLink
                className="footer-link"
                to="https://www.instagram.com/titanium__official?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
              >
                <FontAwesomeIcon
                  className="footer-icon"
                  icon={fab.faInstagram}
                />
              </NavLink>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
