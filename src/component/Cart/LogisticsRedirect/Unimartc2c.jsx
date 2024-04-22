import React, { useEffect } from "react";
import axios from "../../api/axios";

export default function Unimart() {
  useEffect(() => {
    trigger();
  }, []);
  const mapFormHandler = () => {
    const form = document.getElementById("_form_map");
    form?.submit();
  };
  const trigger = async () => {
    try {
      const LogisticsSubType = "UNIMARTC2C";
      const IsCollection = "N";
      const getOnlyRes = await axios
        .post(
          "/cart/map",
          {
            LogisticsSubType,
            IsCollection,
          },
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            withCredentials: true,
          }
        )
        .then((result) => {
          return result.data;
        });
      console.log(getOnlyRes);
      let container = document.getElementById("mapContainer");
      container.innerHTML = getOnlyRes;
      mapFormHandler();
    } catch (err) {
      console.log("trigger Error: ", err);
    }
  };
  return (
    <>
      <div id="mapContainer"></div>
    </>
  );
}
