import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import homeVideo from "/zippo3_1_animation.mp4";
import home2Img1 from "/img/test3.png";
import home2Img2 from "/img/titanium_acc.jpeg";
import "./Home.css";
export default function HomePage() {
  return (
    <>
      <section id="home">
        <div className="home-section home-1">
          <div className="home-sec home-left">
            <h1 className="home-logo">TITANIUM</h1>
            <span className="home-text">Your Every Day Carry items</span>
            <div className="home-links">
              <NavLink className="home-link" to="#">
                SHOP ZIPPO
              </NavLink>
              <NavLink className="home-link home-link-rht" to="#">
                SHOP ACCESSORY
              </NavLink>
            </div>
          </div>
          <div className="home-sec home-right">
            <NavLink to="#">
              <video autoPlay muted loop>
                <source src={homeVideo} type="video/mp4" autoPlay />
                Your browser does not support the video tag.
              </video>
            </NavLink>
          </div>
        </div>
        <div className="home-section home-2">
          <h2 className="home2-title">collections</h2>
          <div className="home2-main">
            <NavLink to="#">
              <div className="home2-sec">
                <img className="home2-img" src={home2Img1} alt="" />
                <span className="home2-text">
                  zippo <br />
                  collection
                </span>
              </div>
            </NavLink>
            <NavLink to="#">
              <div className="home2-sec">
                <img className="home2-img" src={home2Img2} alt="" />
                <span className="home2-text">
                  accessory <br />
                  collection
                </span>
              </div>
            </NavLink>
          </div>
        </div>
      </section>
    </>
  );
}
