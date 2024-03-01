import React, { useEffect, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { TiWeatherPartlySunny } from "react-icons/ti";
import Brezzometeraqi from "../Brezzometer-aqi/Brezzometer-aqi";
import { WiSunrise, WiSunset } from "react-icons/wi";

const Weatherchannel = () => {
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
      `https://api.openweathermap.org/data/2.5/forecast?lat=22.310696&lon=73.192635&appid=${API_KEY}`
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
          `https://api.openweathermap.org/data/2.5/forecast?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}`
        );
        // const AQIres = await fetch(
        //   `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY}`,
        //   {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({
        //       location: {
        //         latitude: position.coords.latitude,
        //         longitude: position.coords.longitude,
        //       },
        //       extraComputations: [
        //         "HEALTH_RECOMMENDATIONS",
        //         "DOMINANT_POLLUTANT_CONCENTRATION",
        //         "POLLUTANT_CONCENTRATION",
        //         "LOCAL_AQI",
        //         "POLLUTANT_ADDITIONAL_INFO",
        //       ],
        //       languageCode: "en",
        //     }),
        //   }
        // );

        // if (!response.ok) {
        //   throw new Error("Failed to fetch AQI data");
        // }
        // if (!AQIres.ok) {
        //   throw new Error("Failed to fetch AQI data");
        // }
        // console.log("AQIres", AQIres);
        console.log(response, "response");
        const data = await response.json();
        setCity(data.name);
        // setAqiData(await AQIres.json());
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
                  <h2>cod: {aqiData?.cod}</h2>
                  <p>cnt: {aqiData?.cnt}</p>
                  {aqiData?.list?.map(
                    (
                      listitem: {
                        main: {
                          temp: any;
                        };
                      },
                      index: any
                    ) => {
                      return (
                        <div className="" key={index}>
                          <h3 className="">
                            temp:{listitem.main.temp - 273}°C
                          </h3>
                        </div>
                      );
                    }
                  )}
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

export default Weatherchannel;
