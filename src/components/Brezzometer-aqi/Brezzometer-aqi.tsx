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

const iconobj = [
  { isNight: true, sky: "clear", value: "clear-night" },
  { isNight: true, sky: "clouds", value: "partly-cloudy-night" },
  { isNight: false, sky: "clear", value: "clear-day" },
  { isNight: false, sky: "clouds", value: "partly-cloudy-day" },
];

const Brezzometeraqi = ({
  aqiData,
  city,
  weatherData,
  openModel,
  setOpenModel,
}: {
  aqiData: AqiData;
  city: string;
  weatherData: any;
  openModel: boolean;
  setOpenModel: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedPollutant, setSelectedPollutant] = useState<string | null>(
    aqiData?.pollutants?.[0]?.code ?? null
  );
  const initialSelectedTab = Object.keys(
    aqiData?.healthRecommendations ?? {}
  )[0];
  const [selectedTab, setSelectedTab] = useState<string | null>(
    initialSelectedTab
  );
  const aqiWrapperRef = React.useRef(null);

  React.useEffect(() => {
    document.addEventListener("mousedown", outsideClickHandler);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", outsideClickHandler);
    };
  }, [aqiWrapperRef]);

  console.log("weather Data: ", weatherData);
  console.log("aqi Data: ", aqiData);

  const calculateRotationAngle = () => {
    // Check if aqiData and aqiData.indexes are defined before accessing the AQI value
    if (
      aqiData &&
      aqiData.indexes &&
      aqiData.indexes.length > 0 &&
      aqiData.indexes[1]?.aqi !== undefined
    ) {
      const aqiValue = aqiData.indexes[1].aqi;
      // Define your logic to calculate rotation angle based on AQI value
      // Adjust the multiplier and conditions based on your requirements

      const minAqi = 0;
      const maxAqi = 500;

      // Ensure that the provided AQI value is within the valid range
      const validAqi = Math.min(Math.max(aqiValue, minAqi), maxAqi);

      // if (aqiValue <= 50) {
      //   rotationAngle = aqiValue * (180 / 50); // Rotate up to 180 degrees for AQI <= 50
      // } else if (aqiValue <= 100) {
      //   rotationAngle = 180 + (aqiValue - 50) * (180 / 50); // Rotate from 180 to 360 degrees for AQI 51-100
      // } else if (aqiValue <= 150) {
      //   rotationAngle = 360 + (aqiValue - 100) * (180 / 50); // Rotate from 360 to 540 degrees for AQI 101-150
      // } // Add more conditions as needed

      return (validAqi / maxAqi) * 180;
    }
    // Return a default rotation angle if AQI data is not available
    return 0;
  };

  const outsideClickHandler = (e: MouseEvent) => {
    if (aqiWrapperRef.current && !aqiWrapperRef.current.contains(e.target)) {
      setOpenModel(false);
      console.log("You clicked outside of me!");
    }
  };

  const handleTabClick = (tabName: string) => {
    setSelectedTab(tabName);
  };
  const handlePollutantTabClick = (tabName: string) => {
    setSelectedPollutant(tabName);
  };
  const datetime = aqiData?.dateTime;
  const formattedDateTime = moment(datetime).format("hh:mm . MM/DD");
  // console.log(formattedDateTime);

  //  Select SVG Image source
  const isNight: boolean =
    new Date().getHours() >= 18 || new Date().getHours() < 6;

  return (
    <div className="absolute top-0 left-0 flex justify-center items-center w-screen h-screen bg-[#2424245a] model">
      <div
        className="absolute h-screen w-screen bg-black z-[-1]"
        onClick={() => setOpenModel(false)}
      ></div>
      <div
        className="max-w-[70%] flex gap-4 rounded-lg p-10"
        ref={aqiWrapperRef}
        style={{
          backgroundImage: "url(/Images/cloudy.jpg)",
          backgroundSize: "cover",
        }}
      >
        <div className="basis-[40%]">
          <div className="h-fit w-[450px] text-black rounded-xl shadow-lg p-4 backdrop-blur-xl border-[4px] border-[#ffffff92] bg-[#ffffff4a]">
            {aqiData?.dateTime && (
              <div className="flex flex-wrap justify-between ">
                <div className="flex flex-col ">
                  <h4 className="font-bold text-4xl my-4">{city}</h4>
                  <p className="text-lg my-1">{formattedDateTime}</p>

                  {weatherData && (
                    <p className="text-6xl whitespace-nowrap">
                      {weatherData?.main?.temp.toFixed(0) - 273}° C
                    </p>
                  )}
                  <p className="capitalize mt-4 text-black border-blue-300 border-4 rounded-full p-2 font-semibold text-center whitespace-nowrap">
                    {weatherData?.weather[0]?.description}
                  </p>
                </div>
                {/* <p className="text-xl font-bold">
                  wind : {weatherData?.wind?.speed}
                </p> */}
                <div className="relative min-w-[100px] grow-[1] aspect-square">
                  <Image
                    src={`/Images/production/fill/openweathermap/${weatherData.weather[0].icon}.svg`}
                    // height={300}
                    // width={300}
                    fill
                    className="object-cover"
                    alt={`${weatherData.weather[0].description}`}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="my-3">
            <div className="h-[300px] w-[450px] text-black  rounded-xl  shadow-lg p-4 border-[4px] border-[#ffffff92]  backdrop-blur-xl ">
              <h4 className="text-black text-2xl text-center p-4">AQI Meter</h4>
              <div className="flex justify-center">
                {/* --- meter ui --- */}
                <div className="flex flex-col items-center ">
                  {/* --- meter --- */}
                  <div className="semi-circle flex justify-center items-end">
                    <div className="inner-circle flex justify-center items-end "></div>
                  </div>
                  {/* --- arrow --- */}
                  <div className="w-full">
                    <div
                      className="arrow"
                      style={{
                        transform: `rotate(${calculateRotationAngle()}deg)`,
                      }}
                      // data-angle={calculateRotationAngle() + "deg"}
                    ></div>
                  </div>
                  {/* --- font --- */}
                  <div className="text-black flex flex-col items-center mt-6">
                    <span className="text-5xl">{aqiData.indexes![1]?.aqi}</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-[-10px] right-[-50px]">
                <div
                  className="relative h-[200px] w-[200px]"
                  style={{ mixBlendMode: "multiply" }}
                >
                  <Image
                    src={
                      aqiData.indexes[1].aqi < 10
                        ? "/Images/boy-without-mask.png"
                        : "/Images/boy-with-mask.png"
                    }
                    fill
                    alt="boy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="basis-[60%]">
          <div className="max-h-1/2 rounded-xl  shadow-lg p-4 border-[4px] border-[#ffffff92] bg-[#ffffff4a] backdrop-blur-xl">
            {aqiData && (
              <div className="text-black ">
                <p className="m-3 text-2xl font-bold font-mono">Health Tips</p>
                <div className="border-b-2 rounded-xl  shadow-lg p-4 border-[4px] border-[#ffffff28]  backdrop-blur-xl w-full">
                  <ul className="flex  items-center p-2 ">
                    <li
                      className={`text-black text-xl p-4 m-2  cursor-pointer ${
                        selectedTab === "generalPopulation"
                          ? "rounded-full  bg-blue-400 text-white "
                          : "bg-gray-400 rounded-full text-white"
                      }`}
                      onClick={() => handleTabClick("generalPopulation")}
                    >
                      <FaPeopleGroup />
                    </li>
                    <li
                      className={`text-black text-xl    p-4 m-2  cursor-pointer ${
                        selectedTab === "lungDiseasePopulation"
                          ? "rounded-full p-4 bg-blue-400 text-white "
                          : "bg-gray-400 rounded-full text-white"
                      }`}
                      onClick={() => handleTabClick("lungDiseasePopulation")}
                    >
                      <FaLungsVirus />
                    </li>
                  </ul>
                </div>

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
          <div className="h-1/2 my-3  text-black rounded-xl  shadow-lg p-4 border-[4px] border-[#ffffff92] bg-[#ffffff4a]  backdrop-blur-xl">
            <div>
              <h2 className="text-3xl text-center my-4">
                What am I breathing right now?
              </h2>
            </div>
            <div className="flex flex-col">
              {aqiData.pollutants &&
                aqiData.pollutants?.map((pol, i) => (
                  <p
                    className={`flex justify-between p-1 ${
                      i !== aqiData.pollutants?.length ?? 0 - 1
                        ? "border-b-2"
                        : ""
                    }`}
                    key={pol.code}
                  >
                    <span>{pol.displayName}</span>
                    <span className="text-gray-500">
                      {pol.concentration.value} ppb
                    </span>
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brezzometeraqi;
