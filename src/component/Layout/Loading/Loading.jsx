import React from "react";

import "./Loading.css";

export default function Loading() {
  const loading = [
    "L",
    "o",
    "a",
    "d",
    "i",
    "n",
    "g",
    ".",
    ".",
    ".",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];
  return (
    <>
      <section id="loading">
        <div className="preloader-frame">
          <div className="preloader">
            <div className="preloader__ring">
              {" "}
              {loading.map((text) => {
                return (
                  <div
                    key={Math.floor(Math.random() * 100000)}
                    className="preloader__sector"
                  >
                    {text}
                  </div>
                );
              })}
            </div>
            <div className="preloader__ring">
              {" "}
              {loading.map((text) => {
                return (
                  <div
                    key={Math.floor(Math.random() * 100000)}
                    className="preloader__sector"
                  >
                    {text}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
