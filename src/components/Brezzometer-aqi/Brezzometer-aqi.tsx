import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { TiWeatherPartlySunny } from "react-icons/ti";

//Air Quality Data
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
//Weather Data
// interface WeatherData {
//   name?: string;
//   main: number;
//   temp: number;
//   weather?: weather[];
// }
interface weather {
  description?: string;
}
// interface Location {
//   lat?: number;
//   lng?: number;
// }

const Brezzometeraqi: React.FC = () => {
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [weatherData, setWeatherData] = useState<any | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("");
  const API_KEY = "a1fe25326ae4eee8d168af7a90cfb548";

  console.log(city, "city");
  console.log(aqiData, "aqiData");
  console.log(weatherData, "weatherData");

  const getBackgroundColor = () => {
    if (aqiData && aqiData.indexes && aqiData?.indexes[1]?.category) {
      const category = aqiData?.indexes[1]?.category?.toLowerCase();
      if (category === "satisfactory air quality") {
        return "bg-green-500"; // Good air quality
      } else if (category === "moderate air quality") {
        return "bg-yellow-500"; // Moderate air quality
      } else if (category === "low air quality") {
        return "bg-red-500"; // Low air quality
      } else {
        return "bg-gray-500"; // Default background color for other cases
      }
    }
    return "bg-gray-500"; // Default background color if category is not available
  };

  const toggleModel = () => {
    setOpenModel(!openModel);
  };
  const fetchAQIData = () => {
    setError(null);
  };

  useEffect(() => {
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
  const calculateRotationAngle = () => {
    // Check if aqiData and aqiData.indexes are defined before accessing the AQI value
    if (
      aqiData &&
      aqiData.indexes &&
      aqiData.indexes.length > 0 &&
      aqiData.indexes[1]?.aqi !== undefined
    ) {
      const aqiValue = aqiData?.indexes[1]?.aqi;
      // Define your logic to calculate rotation angle based on AQI value
      // For example, let's say you want to rotate the image based on the AQI value between 0 and 500 degrees
      // You can adjust this logic based on your requirements
      console.log(aqiValue, "aqivalue");

      return aqiValue * (500 / 500); // Adjust the multiplier to fit your desired range
    }
    // Return a default rotation angle if AQI data is not available
    return 0;
  };

  return (
    <div>
      <div className="container mx-auto">
        <div className=" justify-end items-center">
          <div
            className={`m-4 p-4 rounded-md   cursor-pointer ${getBackgroundColor()} grid grid-cols-1 md:grid-cols-2`}
          >
            <div className="flex flex-col">
              <div className="mx-5">
                <div className="my-3">
                  <TiWeatherPartlySunny className="w-10 h-10" />
                </div>

                <h3 className="text-white text-lg font-semibold">
                  Air Quality of {city}
                </h3>

                {/* {aqiData?.indexes && (
                  <div className="text-lg font-bold   text-white  w-full capitalize">
                    {aqiData?.indexes?.map((indexes, i) => (
                      <div key={i}>
                        <h5 className="">
                          indexes-category:
                          <span className="text-base">{indexes?.category}</span>
                        </h5>
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
              {weatherData && (
                <div className=" mx-5 mb-5">
                  {/* <h2>Name of City: {weatherData?.name}</h2> */}
                  <p> {weatherData?.main?.temp - 273}°C</p>
                  <p className="">{weatherData?.wind?.speed}</p>
                  <p> {weatherData?.weather[0]?.description}</p>
                  <div className="flex items-center">
                    <p className="flex items-center mb-2">
                      sunrise: {weatherData?.sys?.sunrise}
                      <span className="mx-4">
                        <GiSunrise className="w-6 h-6" />
                      </span>
                    </p>
                    <p className="flex items-center ">
                      sunset: {weatherData?.sys?.sunset}
                      <span className="mx-4">
                        <GiSunset className="w-6 h-6" />
                      </span>
                    </p>
                  </div>

                  <div
                    onClick={toggleModel}
                    className="flex justify-center bg-black text-white rounded-lg w-1/2 p-2"
                  >
                    <button className="">More Details</button>
                    <FaArrowCircleRight
                      className="text-xl text-white  mx-2 my-1 bg-black rounded-full"
                      onClick={fetchAQIData}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="relative bg-white my-3 shadow-md rounded-lg  p-2">
                <div className="transition-opacity duration-200 ease-out-quart">
                  <div className="flex flex-col items-center justify-between  mt-6">
                    <div className="gauge relative select-none">
                      <div className="relative w-[155px] h-[81px]">
                        <svg className="w-full h-full rotate-180">
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="white"
                            strokeWidth="10"
                            strokeDasharray="229.3362637120549, 458.6725274241098"
                            fill="none"
                            style={{ transform: "translateY(-36.5px);" }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="#00B050"
                            strokeWidth="8"
                            strokeDasharray="229.3362637120549, 458.6725274241098"
                            fill="none"
                            style={{
                              transform: "translateY(-36.5px)",
                              opacity: "0.3;",
                            }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="white"
                            strokeWidth="10"
                            strokeDasharray="191.11355309337907, 458.6725274241098"
                            fill="none"
                            style={{ transform: "translateY(-36.5px);" }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="#92D050"
                            strokeWidth="8"
                            strokeDasharray="191.11355309337907, 458.6725274241098"
                            fill="none"
                            style={{
                              transform: "translateY(-36.5px)",
                              opacity: "0.3;",
                            }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="white"
                            strokeWidth="10"
                            strokeDasharray="152.89084247470328, 458.6725274241098"
                            fill="none"
                            style={{ transform: "translateY(-36.5px);" }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="#FFFF00"
                            strokeWidth="8"
                            strokeDasharray="152.89084247470328, 458.6725274241098"
                            fill="none"
                            style={{ transform: "translateY(-36.5px);" }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="white"
                            strokeWidth="10"
                            strokeDasharray="114.66813185602744, 458.6725274241098"
                            fill="none"
                            style={{ transform: "translateY(-36.5px);" }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="#FF6500"
                            strokeWidth="8"
                            strokeDasharray="114.66813185602744, 458.6725274241098"
                            fill="none"
                            style={{
                              transform: "translateY(-36.5px)",
                              opacity: "0.3;",
                            }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="white"
                            strokeWidth="10"
                            strokeDasharray="76.44542123735164, 458.6725274241098"
                            fill="none"
                            style={{ transform: "translateY(-36.5px);" }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="#FF0000"
                            strokeWidth="8"
                            strokeDasharray="76.44542123735164, 458.6725274241098"
                            fill="none"
                            style={{
                              transform: "translateY(-36.5px)",
                              opacity: "0.3;",
                            }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="white"
                            strokeWidth="10"
                            strokeDasharray="38.222710618675805, 458.6725274241098"
                            fill="none"
                            style={{ transform: "translateY(-36.5px);" }}
                          ></circle>
                          <circle
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="#C00000"
                            strokeWidth="8"
                            strokeDasharray="38.222710618675805, 458.6725274241098"
                            fill="none"
                            style={{
                              transform: "translateY(-36.5px)",
                              opacity: "0.3;",
                            }}
                          ></circle>
                          <circle
                            id="seperators"
                            r="73"
                            cx="50%"
                            cy="50%"
                            stroke="white"
                            strokeWidth="8"
                            strokeDasharray="1, 37.22271061867581"
                            fill="none"
                            style={{ transform: "translateY(-36.5px);" }}
                          ></circle>
                        </svg>
                        <div
                          className="absolute bottom-0 w-full transform duration-500 transitiontimingfunction"
                          style={{
                            transform: `rotate(${calculateRotationAngle()}deg)`,
                          }}
                        >
                          <Image
                            src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOSIgaGVpZ2h0PSI4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjQuNSIgY3k9IjQiIHI9IjMuNSIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjMDAwIi8+PC9zdmc+"
                            alt="Air Quality Gauge Dot"
                            width={10}
                            height={10}
                            style={{ width: "auto", height: "auto" }}
                          ></Image>
                        </div>
                      </div>
                      <div className=" absolute top-0 left-0 mt-6 h-16 w-full flex justify-center items-center text-center">
                        <div className="font-medium text-gray-800 text-5xl">
                          {aqiData?.indexes &&
                            aqiData.indexes.length > 0 &&
                            aqiData.indexes[1]?.aqi !== undefined &&
                            aqiData?.indexes[1]?.aqi}
                        </div>
                      </div>
                      <div className=" flex justify-between text-sm text-gray-500 -mt-1">
                        <div className="min w-8 h-6 -ml-3 text-center">0</div>
                        <div className="max w-8 h-6 -mr-3 text-center">500</div>
                      </div>
                    </div>
                    <div className=" text-center mt-1">
                      <div className="category font-semibold text-gray-800 text-base capitalize">
                        {aqiData?.indexes && (
                          <div className="text-lg font-semibold   text-black  w-full capitalize">
                            {aqiData?.indexes?.map((indexes, i) => (
                              <div key={i}>
                                <h5 className="">
                                  indexes-category:
                                  <span className="text-base">
                                    {indexes?.category}
                                  </span>
                                </h5>
                              </div>
                            ))}
                          </div>
                        )}{" "}
                      </div>
                    </div>
                    <hr className="my-3 w-full border-gray-200" />
                    <div className="dominant-pollutant flex mt-3 -mb-1">
                      <span className="mr-1 font-normal text-gray-500 text-sm">
                        Dominant Pollutant -
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">Error: {error}</p>}
        {aqiData && (
          <div className="p-4 m-3 border bg-green-800 border-gray-300 rounded-lg shadow-md text-white">
            <div className="mt-4 text-lg font-bold flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold mb-2">
                Air Quality Data:{city}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2"></div>
              <div className=" text-lg font-bold capitalize bg-white text-green-600 p-4 m-3 rounded-xl w-full">
                {aqiData?.dateTime && (
                  <h4 className="text-black">
                    dateTime:
                    <span className="text-green-600 text-base">
                      {aqiData?.dateTime}
                    </span>
                  </h4>
                )}
                {aqiData?.regionCode && (
                  <>
                    <h4 className="text-black">
                      regionCode:
                      <span className="text-green-600 text-base">
                        {aqiData?.regionCode}
                      </span>
                    </h4>
                  </>
                )}
              </div>
              {aqiData?.indexes && (
                <div className="text-lg font-bold  bg-white text-green-600 p-4 m-3 rounded-xl w-full capitalize">
                  {aqiData?.indexes?.map((indexes, i) => (
                    <div key={i}>
                      <h3 className="text-black underline my-3">Indexes</h3>
                      <h5 className="text-black">
                        indexescode:
                        <span className="text-green-600 text-base">
                          {indexes?.code}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        indexesdisplayName:
                        <span className="text-green-600 text-base">
                          {indexes?.displayName}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        indexesapi:
                        <span className="text-green-600 text-base">
                          {indexes?.aqi}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        indexescolorred:
                        <span className="text-green-600 text-base">
                          {indexes?.color?.red}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        indexescolorgreen:
                        <span className="text-green-600 text-base">
                          {indexes?.color?.green}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        indexescolorblue:
                        <span className="text-green-600 text-base">
                          {indexes?.color?.blue}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        indexescategory:
                        <span className="text-green-600 text-base">
                          {indexes?.category}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        indexesdominantPollutant:
                        <span className="text-green-600 text-base">
                          {indexes?.dominantPollutant}
                        </span>
                      </h5>
                    </div>
                  ))}
                </div>
              )}

              {aqiData?.pollutants && (
                <div className="text-lg font-bold capitalize bg-white text-green-600 p-4 m-3 rounded-xl w-full">
                  {aqiData?.pollutants?.map((pollutants, i) => (
                    <div key={i}>
                      <h3 className="underline my-4 text-black">pollutants</h3>
                      <h5 className="text-black">
                        code:
                        <span className="text-green-600 text-base">
                          {pollutants?.code}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        displayName:
                        <span className="text-green-600 text-base">
                          {pollutants?.displayName}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        fullName:
                        <span className="text-green-600 text-base">
                          {pollutants?.fullName}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        concentrationvalue:
                        <span className="text-green-600 text-base">
                          {pollutants?.concentration?.value}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        concentrationunits:
                        <span className="text-green-600 text-base">
                          {pollutants?.concentration?.units}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        additionalInfosources:
                        <span className="text-green-600 text-base">
                          {pollutants?.additionalInfo?.sources}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        additionalInfoeffects:
                        <span className="text-green-600 text-base">
                          {pollutants?.additionalInfo?.effects}
                        </span>
                      </h5>
                      {/* <h5 className="text-black">
                        category:
                        <span className="text-green-600 text-base">
                          {pollutants?.category}
                        </span>
                      </h5>
                      <h5 className="text-black">
                        dominantPollutant:
                        <span className="text-green-600 text-base">
                          {pollutants?.dominantPollutant}
                        </span>
                      </h5> */}
                    </div>
                  ))}
                </div>
              )}

              {aqiData?.healthRecommendations && (
                <div className="capitalize bg-white  p-6 m-3 rounded-xl w-full">
                  <p className="underline text-black my-3">
                    healthRecommendations:
                  </p>
                  <ul className="text-base font-semibold text-green-600">
                    {aqiData?.healthRecommendations?.generalPopulation && (
                      <li className="my-3 list-disc">
                        <p className="text-black underline my-2">
                          generalPopulation:
                        </p>
                        <span className="">
                          {aqiData?.healthRecommendations?.generalPopulation}
                        </span>
                      </li>
                    )}
                    {aqiData?.healthRecommendations?.elderly && (
                      <li className="my-3 list-disc">
                        <p className="text-black underline my-2">elderly:</p>
                        <span className="">
                          {aqiData?.healthRecommendations?.elderly}
                        </span>
                      </li>
                    )}
                    {aqiData?.healthRecommendations?.lungDiseasePopulation && (
                      <li className="my-3 list-disc">
                        <p className="text-black underline my-2">
                          lungDiseasePopulation:
                        </p>
                        <span className="">
                          {
                            aqiData?.healthRecommendations
                              ?.lungDiseasePopulation
                          }
                        </span>
                      </li>
                    )}
                    {aqiData?.healthRecommendations?.heartDiseasePopulation && (
                      <li className="my-3 list-disc">
                        <p className="text-black underline my-2">
                          heartDiseasePopulation:
                        </p>
                        <span className="">
                          {
                            aqiData?.healthRecommendations
                              ?.heartDiseasePopulation
                          }
                        </span>
                      </li>
                    )}
                    {aqiData?.healthRecommendations?.athletes && (
                      <li className="my-3 list-disc">
                        <p className="text-black underline my-2">athletes:</p>
                        <span className="">
                          {aqiData?.healthRecommendations?.athletes}
                        </span>
                      </li>
                    )}
                    {aqiData?.healthRecommendations?.pregnantWomen && (
                      <li className="my-3 list-disc">
                        <p className="text-black underline my-2">
                          pregnantWomen:
                        </p>
                        <span className="">
                          {aqiData?.healthRecommendations?.pregnantWomen}
                        </span>
                      </li>
                    )}
                    {aqiData?.healthRecommendations?.children && (
                      <li className="my-3 list-disc">
                        <p className="text-black underline my-3">children: </p>
                        <span className="">
                          {aqiData?.healthRecommendations?.children}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brezzometeraqi;
