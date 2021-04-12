import React, { useEffect, useState } from "react";
import axios from "axios";
import * as moment from "moment";
import "./App.scss";
import cities from "./data/ukcities.json";
import { useGA4React } from "ga-4-react";

let apiKey = "3d7132f0e89f9435962d14739075d98d";

function App() {
  const [place, setPlace] = useState<any>("London");
  // const [lon, setLon] = useState<any>(-0.33333);
  const [data, setData] = useState<any>(null);

  const ga = useGA4React();

  // let url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&APPID=${apiKey}&units=metric`;

  // http://api.openweathermap.org/data/2.5/air_pollution/history?lat=508&lon=50&start=1606223802&end=1606482999&appid={APIkey}
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

  cities.sort(function(a: any, b: any) {
    a = a.name.toLowerCase();
    b = b.name.toLowerCase();

    return a < b ? -1 : a > b ? 1 : 0;
  });

  return (
    <>
      <div className="row align-items-start">
        <div className="my-5 col-4">
          <div className="d-flex justify-center">
            <div className="shadow rounded-lg h-600 overflow-auto">
              <ul className="p-4">
                {cities.map((city, index) => (
                  <li
                    className="d-flex p-1 cursor-pointer align-items-center"
                    key={index}
                    onClick={() => {
                      setPlace(city.name);
                    }}
                  >
                    {city.name}{" "}
                    <span className="h4">
                      {city.subcountry == "Scotland"
                        ? "🏴󠁧󠁢󠁳󠁣󠁴󠁿"
                        : city.subcountry == "Wales"
                        ? "🏴󠁧󠁢󠁷󠁬󠁳󠁿"
                        : city.subcountry == "England"
                        ? "🏴󠁧󠁢󠁥󠁮󠁧󠁿"
                        : "🇬🇧"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-5 col-8">
          <div className="shadow rounded-lg overflow-hidden">
            {data != null ? (
              <div
                className="p-4"
                style={
                  data.clouds.all >= 50
                    ? Date.now() >= data.sys.sunset
                      ? { backgroundColor: "#858e96" }
                      : { backgroundColor: "#d0deec" }
                    : Date.now() <= data.sys.sunset
                    ? { backgroundColor: "#87ceeb" }
                    : { backgroundColor: "#191970" }
                }
              >
                <div className="d-flex align-items-center">
                  <h1 className="font-weight-bold">{data.name}</h1>
                  <img
                    className="ml-auto"
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  />
                </div>
                <div className="d-flex align-items-center desc-text justify-content-around">
                  <h6>Sunrise: {moment.unix(data.sys.sunrise).format("LT")}</h6>

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
                <div>
                  <iframe
                    frameBorder="0"
                    className="map"
                    src={`https://maps.google.com/maps?q=${data.coord.lat},${data.coord.lon}&z=12&output=embed`}
                    height="450"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
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
    </>
  );
}

export default App;
