import Link from "next/link";
import React, { useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import Brezzometeraqi from "../Brezzometer-aqi/Brezzometer-aqi";
import Image from "next/image";
import styles from "../../styles/button.module.css";
import AqiButtons from "./AqiButtons";

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
    if (aqiData && !isLoading) setIsLoading(false);
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
        console.log(aqiData, "aqidata");
      });
    } else {
      console.log("didnot call api");
    }
  }, []);

  //weather images
  const clearSkyImage = "/Images/amcharts_weather_icons_1.0.0/animated/day.svg";
  const cloudyImage = "/Images/cloudy.jpg";
  const rainyImage = "/Images/rainy.jpg";
  const smokeImage = "/Images/cloudy-day.png";

  const getBackgroundColor = () => {
    if (aqiData && aqiData.indexes && aqiData.indexes[1]?.category) {
      const category = aqiData.indexes[1].category.toLowerCase();
      let image;
      let animateimage;

      // Determine image based on weather description
      if (weatherData) {
        const weatherDescription =
          weatherData.weather[0]?.description.toLowerCase();
        if (weatherDescription.includes("clear sky")) {
          image = "/Images/reshot-icon-smile-9E63DBP5AS.svg";
          animateimage = "/Images/3u1o_io5j_230530.svg";
        } else if (weatherDescription.includes("cloudy")) {
          image = "/Images/cloudy-image.svg"; // Add the path to your cloudy image
          animateimage = "/Images/cloudy-animation.svg"; // Add the path to your cloudy animation
        } else if (weatherDescription.includes("rain")) {
          image = "/Images/rainy-image.svg"; // Add the path to your rainy image
          animateimage = "/Images/rainy-animation.svg"; // Add the path to your rainy animation
        } else {
          image = "/Images/default-image.svg"; // Default image for other weather conditions
          animateimage = "/Images/default-animation.svg"; // Default animation for other weather conditions
        }
      }

      if (category === "satisfactory air quality") {
        return {
          backgroundColor:
            "bg-green-200 bg-opacity-25 border-2 border-green-500",
          image: image,
          animateimage: animateimage,
        };
      } else if (category === "moderate air quality") {
        return {
          image: "/Images/reshot-icon-face-F7VRNJ2HZU.svg",
          backgroundColor:
            "bg-yellow-300 bg-opacity-30 border-2 border-yellow-500",
          // image: image,
          animateimage: animateimage,
        };
      } else if (category === "low air quality") {
        return {
          backgroundColor: "bg-red-500 border-2 border-yellow-500",
          image: image,
          animateimage: animateimage,
        };
      } else {
        return { backgroundColor: "bg-sky-300" };
      }
    }
    return { backgroundColor: "bg-sky-300" }; // Default background color if category is not available
  };

  return (
    <div>
      <div className="bg-white m-5 p-5 rounded-xl">
        <div className="md:flex items-center justify-between">
          <div className="md:flex md:items-center md:gap-12 cursor-pointer">
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

          <div className="flex  my-4 md:gap-12">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex h-40 w-full flex-row items-center justify-center">
                <button className="animate-border inline-block rounded-2xl p-2 bg-white bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 bg-[length:400%_400%]">
                  <span className="block rounded-xl bg-white font-bold text-white">
                    <div
                      className={` rounded-xl p-4 cursor-pointer flex justify-between items-center  ${
                        getBackgroundColor().backgroundColor
                      }  `}
                    >
                      <h3 className="text-blue-500  mx-2 text-6xl font-bold flex">
                        AQI
                        {aqiData?.indexes && aqiData?.indexes[1]?.aqi}
                        <span style={{ fontSize: "24px" }}>
                          {aqiData &&
                            aqiData?.indexes != undefined &&
                            aqiData?.indexes[1]?.category
                              ?.toLowerCase()
                              .includes("moderate air quality") && (
                              <Image
                                src={getBackgroundColor().image}
                                width={50}
                                height={50}
                                alt="Air Quality Image"
                                className="mx-2"
                              />
                            )}
                        </span>
                      </h3>
                      <div className="flex flex-col mx-4 text-blue-500">
                        <div className="text-xl flex">
                          {weatherData?.name} {""}
                        </div>
                        <p className="text-4xl flex justify-center items-center">
                          {weatherData?.main?.temp.toFixed(0) - 273}
                          °C
                          <span className="mx-1">
                            {weatherData?.weather[0]?.description
                              .toLowerCase()
                              .includes("clear sky") && (
                              <Image
                                src={clearSkyImage}
                                width={60}
                                height={60}
                                alt="Clear Sky"
                                style={{ fontSize: "44px" }}
                              />
                            )}
                            {weatherData?.weather[0]?.description
                              .toLowerCase()
                              .includes("smoke") && (
                              <Image
                                src={smokeImage}
                                width={50}
                                height={50}
                                alt="smoke"
                              />
                            )}
                            {weatherData?.weather[0]?.description
                              .toLowerCase()
                              .includes("rain") && (
                              <Image
                                src={rainyImage}
                                width={50}
                                height={50}
                                alt="Rainy"
                              />
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Variants for the Demo --- */}
      <div className="flex flex-wrap bg-white text-black rounded-lg p-5 mx-5">
        {AQIButtonsData &&
          AQIButtonsData.map((aData) => (
            <AqiButtons
              key={aData.indexes[0].code}
              aqiData={aData}
              weatherData={{
                weather: [
                  {
                    id: 711,
                    main: "Smoke",
                    description: "smoke",
                    icon: "01d",
                  },
                ],
                main: {
                  temp: 297.14,
                  feels_like: 296.59,
                  temp_min: 297.14,
                  temp_max: 297.14,
                  pressure: 1013,
                  humidity: 38,
                },
                name: "Vadodara",
              }}
            />
          ))}
      </div>
      {/* Conditional rendering of BrezometerAQI component */}
      {openModel && aqiData && (
        <div className="">
          <Brezzometeraqi
            aqiData={aqiData}
            city={city}
            weatherData={weatherData}
            openModel={openModel}
            setOpenModel={setOpenModel}
          />
        </div>
      )}
    </div>
  );
};

const AQIButtonsData = [
  {
    dateTime: "2024-03-05T15:00:00Z",
    regionCode: "in",
    indexes: [
      {},
      {
        code: "ind_cpcb",
        displayName: "NAQI (IN)",
        aqi: 41,
        aqiDisplay: "133",
        color: {
          green: 0.6902,
          blue: 0.3137,
        },
        category: "Good air quality",
        dominantPollutant: "o3",
      },
    ],
  },

  {
    dateTime: "2024-03-05T15:00:00Z",
    regionCode: "in",
    indexes: [
      {},
      {
        code: "ind_cpcb",
        displayName: "NAQI (IN)",
        aqi: 80,
        aqiDisplay: "80",
        color: {
          red: 0.1451,
          green: 0.5882,
          blue: 0.7451,
        },
        category: "Satisfactory air quality",
        dominantPollutant: "o3",
      },
    ],
  },
  {
    dateTime: "2024-03-05T15:00:00Z",
    regionCode: "in",
    indexes: [
      {},
      {
        code: "ind_cpcb",
        displayName: "NAQI (IN)",
        aqi: 133,
        aqiDisplay: "133",
        color: {
          red: 1,
          green: 1,
        },
        category: "Moderate air quality",
        dominantPollutant: "o3",
      },
    ],
  },
  {
    dateTime: "2024-03-05T15:00:00Z",
    regionCode: "in",
    indexes: [
      {},
      {
        code: "ind_cpcb",
        displayName: "NAQI (IN)",
        aqi: 240,
        aqiDisplay: "240",
        color: {
          red: 1,
          green: 0.3961,
        },
        category: "Poor air quality",
        dominantPollutant: "o3",
      },
    ],
  },
  {
    dateTime: "2024-03-05T15:00:00Z",
    regionCode: "in",
    indexes: [
      {},
      {
        code: "ind_cpcb",
        displayName: "NAQI (IN)",
        aqi: 320,
        aqiDisplay: "320",
        color: {
          red: 1,
        },
        category: "Very poor air quality",
        dominantPollutant: "o3",
      },
    ],
  },
  {
    dateTime: "2024-03-05T15:00:00Z",
    regionCode: "in",
    indexes: [
      {},
      {
        code: "ind_cpcb",
        displayName: "NAQI (IN)",
        aqi: 450,
        aqiDisplay: "450",
        color: {
          red: 0.7529,
        },
        category: "Severe air quality",
        dominantPollutant: "o3",
      },
    ],
  },
];

export default Header;
