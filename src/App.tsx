import React, { useEffect, useState } from "react";
import axios from "axios";
import * as moment from "moment";
import "./App.scss";
import cities from "./data/ukcities.json";
import { useGA4React } from "ga-4-react";
import logo from "./assets/logo.png";
import temperature from "./assets/thermometer.svg";
import humidity from "./assets/humidity.svg";
import barometer from "./assets/barometer.svg";
import slugify from "react-slugify";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useParams,
} from "react-router-dom";

let apiKey = "3d7132f0e89f9435962d14739075d98d";
type UrlParamsType = {
  city: string;
};

const Home = () => {
  let { city } = useParams<UrlParamsType>();

  const [place, setPlace] = useState<any>("london");
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
    city != undefined ? getList(place) : getList(city);
  }, [place]);

  cities.sort(function(a: any, b: any) {
    a = a.name.toLowerCase();
    b = b.name.toLowerCase();

    return a < b ? -1 : a > b ? 1 : 0;
  });

  return (
    <>
      <nav className="d-flex justify-content-center my-3">
        <img src={logo} alt="logo" />
      </nav>
      <div className="row">
        <div className="my-3 col-4">
          <div className="d-flex justify-center">
            <div className="shadow rounded-lg h-600 overflow-auto">
              <ul className="p-4">
                {cities.map((city, index) => (
                  <Link
                    to={slugify(`${city.name}`)}
                    onClick={() => {
                      setPlace(city.name);
                      // place = city.name;
                    }}
                    key={index}
                  >
                    <li className="d-flex p-1 cursor-pointer align-items-center">
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
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-3 col-8">
          <div className="shadow rounded-lg overflow-hidden">
            {data != null ? (
              <div
                className="p-4"
                style={
                  data.clouds.all >= 50
                    ? Date.now() >= data.sys.sunset
                      ? { backgroundColor: "#858e96" }
                      : { backgroundColor: "#191970" }
                    : Date.now() <= data.sys.sunset
                    ? { backgroundColor: "#87ceeb" }
                    : { backgroundColor: "#BBC7D4" }
                }
              >
                <div className="d-flex align-items-center">
                  <h1 className="font-weight-bold">{data.name}</h1>
                  <img
                    className="ml-auto"
                    src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  />
                </div>
                <div className="d-flex align-items-center desc-text justify-content-around my-3">
                  <h6>Sunrise: {moment.unix(data.sys.sunrise).format("LT")}</h6>

                  <h6>Sunset: {moment.unix(data.sys.sunset).format("LT")}</h6>
                </div>
                <div className="d-flex align-items-center desc-text my-3">
                  <h6>{data.weather[0].description}</h6>
                </div>
                <div className="d-flex align-items-center my-3">
                  <div className="row w-100">
                    <div className="col">
                      <h1
                        className="font-weight-bold h2 d-flex align-items-center"
                        title={`Temperature in ${data.name}`}
                      >
                        <img src={temperature} />
                        {Math.round(data.main.temp)}°C
                      </h1>
                    </div>
                    <div className="col">
                      <h1
                        className="font-weight-bold h2 d-flex align-items-center"
                        title={`Humidity in ${data.name}`}
                      >
                        <img src={humidity} />
                        {data.main.humidity}%
                      </h1>
                    </div>
                    <div className="col">
                      <h1
                        className="font-weight-bold h2 d-flex align-items-center"
                        title={`Air Pressure in ${data.name}`}
                      >
                        <img src={barometer} />
                        {data.main.pressure}
                      </h1>
                    </div>
                  </div>
                </div>
                <div>
                  <iframe
                    frameBorder="0"
                    className="map"
                    src={`https://maps.google.com/maps?q=${data.coord.lat},${data.coord.lon}&z=12&output=embed`}
                    height="400"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center h-100 my-5 justify-content-center">
                <div className="spinner-border" role="status"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Redirect to="/london" />
        </Route>
        <Route path={`/:city`}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
