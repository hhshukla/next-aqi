import Image from "next/image";
import React, { useState } from "react";

import { FaPeopleGroup } from "react-icons/fa6";
import { MdElderlyWoman } from "react-icons/md";
import { FaLungsVirus } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { FaThLarge } from "react-icons/fa";
import { MdPregnantWoman } from "react-icons/md";
import { FaChildReaching } from "react-icons/fa6";
import moment from "moment";

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

const Brezzometeraqi = ({
  aqiData,
  city,
  weatherData,
}: {
  aqiData: AqiData;
  city: string;
  weatherData: any;
}) => {
  // const [openModel, setOpenModel] = useState<boolean>(false);
  // const [aqiData, setAqiData] = useState<AqiData | null>(null);
  // const [weatherData, setWeatherData] = useState<any | null>(null);
  const [selectedPollutant, setSelectedPollutant] = useState<string | null>(
    null
  );
  const [selectedTab, setSelectedTab] = useState<string | null>();

  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <div>Error: {error}</div>;
  }

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
  const handleTabClick = (tabName: string) => {
    setSelectedTab(tabName);
  };
  const handlePollutantTabClick = (tabName: string) => {
    setSelectedPollutant(tabName);
  };
  const datetime = aqiData?.dateTime;
  const formattedDateTime = moment(datetime).format("YYYY/MM/DD hh:mm:ss");
  console.log(formattedDateTime);

  return (
    <div>
      <div className="container mx-auto">
        <div className={`   p-4  cursor-pointer bg-green-500 mx-6 rounded-lg `}>
          <div className="p-5 grid grid-cols-1  lg:grid-cols-3 gap-2">
            <div className="relative bg-white my-3 shadow-lg rounded-lg w-full p-2 ">
              <div className="transition-opacity duration-200 ease-out-quart ">
                {aqiData?.dateTime && (
                  <h4 className="text-black font-bold p-1 rounded-xl flex flex-col">
                    DateTime:
                    <span className=" text-base">{formattedDateTime}</span>
                  </h4>
                )}
                <div className="flex flex-col items-center justify-between  mt-6">
                  <div className="relative select-none">
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
                          style={{ transform: "t ranslateY(-36.5px);" }}
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
                          className="animate-ping"
                          src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOSIgaGVpZ2h0PSI4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjQuNSIgY3k9IjQiIHI9IjMuNSIgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjMDAwIi8+PC9zdmc+"
                          alt="Air Quality Gauge Dot"
                          width={10}
                          height={10}
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
                    <div className="text-black text-center text-base font-medium ">
                      <p>{city}</p>
                      <div>
                        <p> {weatherData?.weather[0]?.description}</p>

                        <p className="">
                          Today AQI is:
                          {aqiData &&
                            aqiData?.indexes &&
                            aqiData?.indexes.length > 0 &&
                            aqiData?.indexes[1]?.aqi !== undefined &&
                            aqiData?.indexes[1]?.aqi}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {aqiData && (
              <div className="text-white bg-blue-500 shadow-lg p-4 rounded-lg my-2">
                <p className="my-3 text-xl font-bold font-mono">Pollutant</p>
                <ul className="lg:flex justify-between items-center bg-white  rounded-lg p-2">
                  {aqiData?.pollutants?.map((pollutant, index) => (
                    <li
                      key={index}
                      className={`text-black    border-[1px] border-black p-1 rounded-lg cursor-pointer my-2 ${
                        selectedPollutant === pollutant?.code
                          ? "border-2 border-blue-400 text-blue-500"
                          : "bg-white"
                      }`}
                      onClick={() =>
                        handlePollutantTabClick(pollutant?.code ?? "")
                      }
                    >
                      {pollutant?.displayName}
                    </li>
                  ))}
                </ul>
                {selectedPollutant && (
                  <div className="bg-white p-4 my-3  text-blue-500 font-medium rounded-md">
                    <h3 className="text-lg ">
                      {
                        aqiData?.pollutants?.find(
                          (pollutant) => pollutant?.code === selectedPollutant
                        )?.displayName
                      }
                      Details
                    </h3>
                    <p>
                      Full Name:
                      {
                        aqiData?.pollutants?.find(
                          (pollutant) => pollutant?.code === selectedPollutant
                        )?.fullName
                      }
                    </p>
                    <p>
                      Concentration:
                      {
                        aqiData?.pollutants?.find(
                          (pollutant) => pollutant?.code === selectedPollutant
                        )?.concentration?.value
                      }
                      {
                        aqiData?.pollutants?.find(
                          (pollutant) => pollutant?.code === selectedPollutant
                        )?.concentration?.units
                      }
                    </p>
                    <p>
                      Sources:
                      {
                        aqiData?.pollutants?.find(
                          (pollutant) => pollutant?.code === selectedPollutant
                        )?.additionalInfo?.sources
                      }
                    </p>
                    <p>
                      Effects:
                      {
                        aqiData?.pollutants?.find(
                          (pollutant) => pollutant?.code === selectedPollutant
                        )?.additionalInfo?.effects
                      }
                    </p>
                  </div>
                )}
              </div>
            )}
            {aqiData && (
              <div className="text-white bg-blue-500 shadow-lg p-4 rounded-lg my-2">
                <p className="my-3 text-xl font-bold font-mono">
                  Health Recoomendation
                </p>
                <ul className="lg:flex justify-between items-center bg-white  rounded-lg p-2">
                  <li
                    className={`text-black    border-[1px] border-black p-1 my-2 rounded-lg cursor-pointer ${
                      selectedTab === "generalPopulation"
                        ? "border-2 border-blue-400 text-blue-500"
                        : "bg-white"
                    }`}
                    onClick={() => handleTabClick("generalPopulation")}
                  >
                    <FaPeopleGroup />
                  </li>
                  <li
                    className={`text-black    border-[1px] border-black p-1 my-2 rounded-lg cursor-pointer ${
                      selectedTab === "elderly"
                        ? "border-2 border-blue-400 text-blue-500"
                        : "bg-white"
                    }`}
                    onClick={() => handleTabClick("elderly")}
                  >
                    <MdElderlyWoman />
                  </li>
                  <li
                    className={`text-black    border-[1px] border-black p-1 my-2 rounded-lg cursor-pointer ${
                      selectedTab === "lungDiseasePopulation"
                        ? "border-2 border-blue-400 text-blue-500"
                        : "bg-white"
                    }`}
                    onClick={() => handleTabClick("lungDiseasePopulation")}
                  >
                    <FaLungsVirus />
                  </li>
                  <li
                    className={`text-black    border-[1px] border-black p-1 my-2 rounded-lg cursor-pointer ${
                      selectedTab === "heartDiseasePopulation"
                        ? "border-2 border-blue-400 text-blue-500"
                        : "bg-white"
                    }`}
                    onClick={() => handleTabClick("heartDiseasePopulation")}
                  >
                    <FaHeart />
                  </li>
                  <li
                    className={`text-black    border-[1px] border-black p-1 my-2 rounded-lg cursor-pointer ${
                      selectedTab === "athletes"
                        ? "border-2 border-blue-400 text-blue-500"
                        : "bg-white"
                    }`}
                    onClick={() => handleTabClick("athletes")}
                  >
                    <FaThLarge />
                  </li>
                  <li
                    className={`text-black    border-[1px] border-black p-1 my-2 rounded-lg cursor-pointer ${
                      selectedTab === "pregnantWomen"
                        ? "border-2 border-blue-400 text-blue-500"
                        : "bg-white"
                    }`}
                    onClick={() => handleTabClick("pregnantWomen")}
                  >
                    <MdPregnantWoman />
                  </li>
                  <li
                    className={`text-black    border-[1px] border-black p-1 my-2 rounded-lg cursor-pointer ${
                      selectedTab === "children"
                        ? "border-2 border-blue-400 text-blue-500"
                        : "bg-white"
                    }`}
                    onClick={() => handleTabClick("children")}
                  >
                    <FaChildReaching />
                  </li>
                </ul>
                {selectedTab && (
                  <div className="bg-white p-4 my-3 rounded-xl text-blue-500">
                    <h3 className="text-lg font-semibold">
                      {selectedTab === "generalPopulation"
                        ? "General Population"
                        : ""}
                      {selectedTab === "elderly" ? "elderly" : ""}
                      {selectedTab === "lungDiseasePopulation"
                        ? "lungDiseasePopulation"
                        : ""}
                      {selectedTab === "heartDiseasePopulation"
                        ? "heartDiseasePopulation"
                        : ""}
                      {selectedTab === "athletes" ? "athletes" : ""}
                      {selectedTab === "pregnantWomen" ? "pregnantWomen" : ""}
                      {selectedTab === "children" ? "children" : ""}
                    </h3>
                    <p>
                      {aqiData?.healthRecommendations && selectedTab
                        ? aqiData?.healthRecommendations[
                            selectedTab as keyof HealthRecommendations
                          ]
                        : ""}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">Error: {error}</p>}
      </div>
    </div>
  );
};

export default Brezzometeraqi;
