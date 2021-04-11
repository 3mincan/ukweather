import React, { useMemo } from "react";
import { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
import cities from "./data/ukcities.json";
import "bootstrap/dist/css/bootstrap.css";
import * as moment from "moment";

let apiKey = "3d7132f0e89f9435962d14739075d98d";

function App() {
  const [place, setPlace] = useState<any>("London");
  // const [lon, setLon] = useState<any>(-0.33333);
  const [data, setData] = useState<any>(null);
  // let url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&APPID=${apiKey}&units=metric`;

  const getList = async (place: string) => {
    await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${place}&APPID=${apiKey}&units=metric`
      )
      .then((res) => {
        const data = res.data;
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getList(place);
    console.log(data);
  }, [place]);

  return (
    <>
      <div className="container">
        <div className="row align-items-start">
          <div className="my-5 col-3">
            <div className="d-flex justify-center">
              <div className="shadow rounded-lg w-full h-600 overflow-auto">
                <ul className="p-4">
                  {cities.map((city, index) => (
                    <li
                      className="p-1 cursor-pointer"
                      key={index}
                      onClick={() => {
                        setPlace(city.name);
                      }}
                    >
                      {city.name}, {city.subcountry}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-5 col-9">
            <div className="shadow rounded-lg overflow-hidden">
              {data != null ? (
                <div
                  className="p-4"
                  style={
                    data.clouds.all >= 50 && Date.now() >= data.sys.sunset
                      ? { backgroundColor: "#C6C6C6" }
                      : data.clouds.all >= 50 && Date.now() <= data.sys.sunset
                      ? { backgroundColor: "#9e9e9e" }
                      : data.clouds.all >= 50 && Date.now() <= data.sys.sunset
                      ? { backgroundColor: "#0073cc" }
                      : { backgroundColor: "#0090FF" }
                  }
                >
                  <div className="d-flex align-items-center">
                    <h1 className="font-weight-bold">{data.name}</h1>
                    <img
                      className="ml-auto"
                      src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                    />
                  </div>
                  <div className="d-flex align-items-center desc-text justify-content-around">
                    <h6>
                      Sunrise: {moment.unix(data.sys.sunrise).format("LT")}
                    </h6>

                    <h6>Sunset: {moment.unix(data.sys.sunset).format("LT")}</h6>
                  </div>
                  <div className="d-flex align-items-center desc-text my-3">
                    <h6>{data.weather[0].description}</h6>
                  </div>
                  <div className="d-flex align-items-center mt-3">
                    <h1 className="font-weight-bold rem-3">
                      {Math.round(data.main.temp)}°C
                    </h1>
                  </div>
                </div>
              ) : (
                <div className="flex align-items-center justify-content-center">
                  <div className="spinner-border" role="status"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
