import React, { useEffect, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { TiWeatherPartlySunny } from "react-icons/ti";
import Brezzometeraqi from "../Brezzometer-aqi/Brezzometer-aqi";
import { WiSunrise, WiSunset } from "react-icons/wi";

const Openweatherapi = () => {
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [aqiData, setAqiData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("");
  const [showaqi, setShowaqi] = useState(false);
  const API_KEY = "a1fe25326ae4eee8d168af7a90cfb548";
  console.log(city, "city");

  const toggleModel = () => {
    setOpenModel(!openModel);
  };

  const fetchAQIData = () => {
    setError(null);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=vadodara&appid=${API_KEY}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch AQI data");
        }
        return response.json();
      })
      .then((data) => {
        setAqiData(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=a1fe25326ae4eee8d168af7a90cfb548`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch AQI data");
        }

        const data = await response.json();
        setCity(data.name);
        fetchAQIData();
      });
    }
  }, []);

  useEffect(() => {
    fetchAQIData();
  }, []);

  return (
    <div>
      <div className="container mx-auto">
        <div className="md:flex justify-end items-center">
          <div className="m-4 p-4 rounded-md bg-green-500  cursor-pointer bg-opacity-50 ">
            <div className="flex justify-between items-end">
              <div className="mx-5">
                <div className="my-3">
                  <TiWeatherPartlySunny className="w-10 h-10" />
                </div>
                <h3 className="text-white text-lg font-semibold">Weather</h3>
                <div>
                  <h2>name: {aqiData?.name}</h2>
                  <p>Temperature: {aqiData?.main?.temp - 273}°C</p>
                  <p>Weather: {aqiData?.weather[0]?.description}</p>
                  <p className="flex items-center">
                    sunrise: {aqiData?.sys?.sunrise}
                    <span className="mx-4">
                      <WiSunrise className="w-6 h-6" />
                    </span>
                  </p>
                  <p className="flex items-center">
                    sunset: {aqiData?.sys?.sunset}
                    <span className="mx-4">
                      <WiSunset className="w-6 h-6" />
                    </span>
                  </p>
                </div>
              </div>
              <button onClick={() => setShowaqi(!showaqi)} className="mx-4">
                Show AQI Data
              </button>
              <button onClick={toggleModel}>
                <FaArrowCircleRight
                  className="text-2xl text-white font-semibold"
                  onClick={fetchAQIData}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* {showaqi && <Brezzometeraqi />} */}
    </div>
  );
};

export default Openweatherapi;
