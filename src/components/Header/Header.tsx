import Link from "next/link";
import React, { useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { TiWeatherPartlySunny } from "react-icons/ti";
import Brezzometeraqi from "../Brezzometer-aqi/Brezzometer-aqi";

interface AqiData {
  dateTime?: string;
  regionCode?: string;
  indexes?: Index[];
  pollutants?: Pollutant[];
  healthRecommendations?: HealthRecommendations;
}

interface Index {
  code?: string;
  displayName?: string;
  aqi?: number;
  color?: {
    red?: number;
    green?: number;
    blue?: number;
  };
  category?: string;
  dominantPollutant?: string;
}

interface Pollutant {
  code?: string;
  displayName?: string;
  fullName?: string;
  concentration?: {
    value?: number;
    units?: string;
  };
  additionalInfo?: {
    sources?: string[];
    effects?: string[];
  };
  category?: string;
  dominantPollutant?: string;
}

interface HealthRecommendations {
  generalPopulation?: string;
  elderly?: string;
  lungDiseasePopulation?: string;
  heartDiseasePopulation?: string;
  athletes?: string;
  pregnantWomen?: string;
  children?: string;
}

const Header = () => {
  const [openModel, setOpenModel] = useState<boolean>(false);

  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [weatherData, setWeatherData] = useState<any | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("");
  const API_KEY = "a1fe25326ae4eee8d168af7a90cfb548";
  const toggleModel = () => {
    setOpenModel(!openModel);
  };
  const fetchAQIData = () => {
    setError(null);
  };
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${API_KEY}`
        );
        const AQIres = await fetch(
          `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              location: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              },
              extraComputations: [
                "HEALTH_RECOMMENDATIONS",
                "DOMINANT_POLLUTANT_CONCENTRATION",
                "POLLUTANT_CONCENTRATION",
                "LOCAL_AQI",
                "POLLUTANT_ADDITIONAL_INFO",
              ],
              languageCode: "en",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch AQI data");
        }
        if (!AQIres.ok) {
          throw new Error("Failed to fetch AQI data");
        }
        console.log("AQIres", AQIres);
        console.log(response, "response");
        const data = await response.json();
        setCity(data.name);
        setAqiData(await AQIres.json());
        setWeatherData(data);
      });
    }
  }, []);

  console.log(city, "city");
  console.log(aqiData, "aqiData");
  console.log(weatherData, "weatherData");
  const getBackgroundColor = () => {
    if (aqiData && aqiData.indexes && aqiData?.indexes[1]?.category) {
      const category = aqiData?.indexes[1]?.category?.toLowerCase();
      if (category === "satisfactory air quality") {
        return "bg-green-500 "; // satisfactory air  quality
      } else if (category === "moderate air quality") {
        return "bg-yellow-500 bg-opacity-50 border-[1px] border-white"; // Moderate air quality
      } else if (category === "low air quality") {
        return "bg-red-500"; // Low air quality
      } else {
        return "bg-gray-500"; // Default background color for other cases
      }
    }
    return "bg-gray-500"; // Default background color if category is not available
  };

  return (
    <header className="bg-black m-5 p-5">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12 cursor-pointer">
            <Link className="block text-teal-600" href="/">
              <h3>Breathe Free</h3>
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="/"
                  >
                    Home
                  </Link>
                </li>
                <li className="">
                  <div
                    className={`my-2 p-2 rounded-md   cursor-pointer ${getBackgroundColor()} `}
                  >
                    <div className="flex flex-col">
                      <div className="mx-5">
                        <div className="my-2">
                          <TiWeatherPartlySunny className="w-5 h-5" />
                        </div>

                        <h3 className="text-white text-sm font-medium">
                          Air Quality of {city}
                        </h3>
                      </div>
                      <div className="flex">
                        {weatherData && (
                          <div className="mx-5">
                            {/* <h2>Name of City: {weatherData?.name}</h2> */}
                            <p> {weatherData?.main?.temp - 273}°C</p>
                            {/* <p className="">{weatherData?.wind?.speed}</p>
                          <p> {weatherData?.weather[1]?.description}</p>
                          <div className="flex items-center">
                            <p className="flex items-center mb-2">
                              sunrise: {weatherData?.sys?.sunrise}
                              <span className="mx-4">
                                <GiSunrise className="w-6 h-6" />
                              </span>
                            </p>
                            <p className="flex items-center mb-2">
                              sunset: {weatherData?.sys?.sunset}
                              <span className="mx-4">
                                <GiSunset className="w-6 h-6" />
                              </span>
                            </p>
                          </div> */}
                          </div>
                        )}
                        <div onClick={toggleModel}>
                          <FaArrowCircleRight className="text-xl text-white  mx-2 my-1 bg-black rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/* Conditional rendering of BrezometerAQI component */}
      {openModel && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <Brezzometeraqi />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
