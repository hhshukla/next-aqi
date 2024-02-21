import React, { useState, useEffect } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { TiWeatherPartlySunny } from "react-icons/ti";

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

const Brezzometeraqi: React.FC = () => {
  const [openModel, setOpenModel] = useState<boolean>(false);
  const [aqiData, setAqiData] = useState<AqiData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserLocation();
  }, []);

  const toggleModel = () => {
    setOpenModel(!openModel);
  };
  const fetchAQIData = () => {
    setError(null);

    const requestBody = {
      location: {
        latitude: 37.419734,
        longitude: -122.0827784,
      },
      extraComputations: [
        "HEALTH_RECOMMENDATIONS",
        "DOMINANT_POLLUTANT_CONCENTRATION",
        "POLLUTANT_CONCENTRATION",
        "LOCAL_AQI",
        "POLLUTANT_ADDITIONAL_INFO",
      ],
      languageCode: "en",
    };

    fetch(
      `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
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

  const fetchUserLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;

        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_APP_GOOGLE_MAPS_API_KEY}`
        )
          .then((response) => response.json())

          .catch((error) => {
            console.error("Error fetching city name:", error);
          });
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  };

  const extractCityName = (data: any) => {
    if (data?.results && data?.results?.length > 0) {
      for (let component of data.results[0].address_components) {
        if (component.types.includes("locality")) {
          return component.long_name;
        }
      }
    }
  };

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

                <h3 className="text-white text-lg font-semibold">
                  Air Quality
                </h3>

                <h3 className="text-white text-base font-medium">Vadodara</h3>
              </div>

              <button onClick={toggleModel}>
                <FaArrowCircleRight
                  className="text-2xl text-white font-semibold"
                  onClick={fetchAQIData}
                />
              </button>
            </div>
          </div>
        </div>
        {error && <p className="text-red-600 mb-4">Error: {error}</p>}
        {aqiData && (
          <div className="p-4 m-3 border bg-green-800 border-gray-300 rounded-lg shadow-md text-white">
            <div className="mt-4 text-lg font-bold flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold mb-2">Air Quality Data:</h3>
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
