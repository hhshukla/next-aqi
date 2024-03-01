import Link from "next/link";
import React, { useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import Brezzometeraqi from "../Brezzometer-aqi/Brezzometer-aqi";
import Image from "next/image";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [weatherData, setWeatherData] = useState<any | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("");
  const API_KEY = "a1fe25326ae4eee8d168af7a90cfb548";
  const toggleModel = () => {
    setOpenModel(!openModel);
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
        const aqidata = await AQIres.json();
        setAqiData(aqidata);
        setWeatherData(data);
        if (aqiData) setIsLoading(false);
      });
    } else {
      console.log("hello");
    }
  }, []);

  const getBackgroundColor = () => {
    if (aqiData && aqiData.indexes && aqiData?.indexes[1]?.category) {
      const category = aqiData?.indexes[1]?.category?.toLowerCase();
      if (category === "satisfactory air quality") {
        return "bg-green-500 "; // satisfactory air  quality
      } else if (category === "moderate air quality") {
        return "bg-yellow-500 "; // Moderate air quality
      } else if (category === "low air quality") {
        return "bg-red-500"; // Low air quality
      } else {
        return "bg-gray-500"; // Default background color for other cases
      }
    }
    return "bg-gray-500"; // Default background color if category is not available
  };

  return (
    <div>
      <div className="bg-white  m-5 p-5  rounded-xl">
        <div className="flex  items-center justify-between">
          <div className="flex-1 md:flex md:items-center md:gap-12 cursor-pointer">
            <Link className="block text-teal-600" href="/">
              <Image
                src={
                  "https://www.breathefree.com/sites/all/themes/breathfree_theme/images/logo.png"
                }
                width={200}
                height={200}
                alt="Air Quality Index Logo"
              />
            </Link>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <button className="bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-md p-1">
                    <div
                      className={` p-2 rounded-md   cursor-pointer ${getBackgroundColor()}`}
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inset-0 inline-flex h-full w-full rounded-full bg-white"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-300"></span>
                      </span>
                      <div className="flex flex-col text-start">
                        <div className="mx-5">
                          <div className="my-2">
                            <MdOutlineWbSunny className="w-5 h-5" />
                          </div>
                          <h2 className="text-xl">{weatherData?.name}</h2>

                          <h3 className="text-white text-sm font-medium">
                            Today AQI of {city} is:
                            {aqiData?.indexes && aqiData?.indexes[1]?.aqi}
                          </h3>
                          <div className="flex items-center">
                            {weatherData && (
                              <div className=" my-2">
                                <p className="text-xl">
                                  {weatherData?.main?.temp.toFixed(0) - 273}°C
                                </p>
                              </div>
                            )}
                            <div onClick={toggleModel}>
                              <FaArrowCircleRight className="text-2xl   mx-2 my-1 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
      {/* Conditional rendering of BrezometerAQI component */}
      {openModel && isLoading && (
        <div className="bg-gradient-to-r from-blue-300 to-blue-500 my-4 p-4 rounded-lg">
          loading...
        </div>
      )}
      {openModel && !isLoading && aqiData && (
        <div className="bg-gradient-to-r from-blue-300 to-blue-500 my-4 p-4 rounded-lg">
          <Brezzometeraqi
            aqiData={aqiData}
            city={city}
            weatherData={weatherData}
          />
        </div>
      )}
    </div>
  );
};

export default Header;