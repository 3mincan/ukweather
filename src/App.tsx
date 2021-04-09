import React from "react";
import { useEffect, useState } from "react";
import "./App.scss";
import axios from "axios";
import cities from "./data/gb.json";
import "bootstrap/dist/css/bootstrap.css";

let apiKey = "3d7132f0e89f9435962d14739075d98d";

function App() {
  const [place, setPlace] = useState<any>("london");
  const [data, setData] = useState<any>(null);
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&APPID=${apiKey}`;

  const getList = async () => {
    await axios
      .get(url)
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
    getList();
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
                        setPlace(city.city);
                      }}
                    >
                      {city.city}
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
                    data.weather[0].main.includes("Clouds")
                      ? { backgroundColor: "#C6C6C6" }
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
                  <div className="d-flex align-items-center desc-text">
                    <h6>{data.weather[0].description}</h6>
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
