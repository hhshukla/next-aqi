// import React, { useState, useEffect } from "react";

// const AQI = () => {
//   const [loading, setLoading] = useState(false);
//   const [aqiData, setAqiData] = useState(null);
//   const [error, setError] = useState(null);
//   const [currentLocationCity, setCurrentLocationCity] = useState("");

//   useEffect(() => {
//     fetchUserLocation();
//   }, []);
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.permissions
//         .query({ name: "geolocation" })
//         .then(function (result) {
//           console.log(result);
//         });
//     } else {
//       console.log("Geolocation is not supported by this browser.");
//     }
//   }, []);

//   const fetchUserLocation = () => {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         console.log(position);
//         const { latitude, longitude } = position.coords;

//         // Fetch the city name based on the user's current location
//         fetch(
//           `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
//         )
//           .then((response) => response.json())
//           .then((data) => {
//             const cityName = extractCityName(data);
//             setCurrentLocationCity(cityName);
//           })
//           .catch((error) => {
//             console.error("Error fetching city name:", error);
//           });
//       },
//       (error) => {
//         console.error("Error getting user's location:", error);
//       }
//     );
//   };

//   const extractCityName = (data) => {
//     if (data?.results && data?.results?.length > 0) {
//       for (let component of data.results[0].address_components) {
//         if (component.types.includes("locality")) {
//           return component.long_name;
//         }
//       }
//     }
//     return "";
//   };

//   const fetchAQIData = () => {
//     setLoading(true);
//     setError(null);

//     const requestBody = {
//       location: {
//         latitude: 37.419734,
//         longitude: -122.0827784,
//       },
//       extraComputations: [
//         "HEALTH_RECOMMENDATIONS",
//         "DOMINANT_POLLUTANT_CONCENTRATION",
//         "POLLUTANT_CONCENTRATION",
//         "LOCAL_AQI",
//         "POLLUTANT_ADDITIONAL_INFO",
//       ],
//       languageCode: "en",
//     };
//     fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=${process.env.REACT_APP_BREEZOMETER_API_KEY}`
//     )
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch AQI data");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setAqiData(data);
//       })
//       .catch((error) => {
//         setError(error.message);
//       });
//     fetch(
//       `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${process.env.REACT_APP_BREEZOMETER_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(requestBody),
//       }
//     )
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch AQI data");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setAqiData(data);
//       })
//       .catch((error) => {
//         setError(error.message);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   return (
//     <div className="p-4 m-3 border bg-green-800 border-gray-300 rounded-lg shadow-md text-white">
//       <h2 className="text-xl font-bold mb-4">Air Quality Information</h2>
//       <p className="mb-2 text-base font-semibold">
//         Current Location City: {currentLocationCity}
//         {console.log(currentLocationCity, "currentlocation")}
//       </p>
//       {error && <p className="text-red-600 mb-4">Error: {error}</p>}
//       <button
//         className={`bg-green-500 text-white px-4 py-2 rounded ${
//           loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
//         }`}
//         onClick={fetchAQIData}
//         disabled={loading}
//       >
//         {loading ? "Loading..." : "Fetch AQI Data"}
//       </button>
//       {aqiData && (
//         <div className="mt-4 text-lg font-bold flex flex-col justify-center items-center">
//           <h3 className="text-lg font-semibold mb-2">AQI Data:</h3>
//           <div className=" text-lg font-bold capitalize bg-white text-green-600 p-4 m-3 rounded-xl w-full">
//             <h4>dateTime:{aqiData?.dateTime}</h4>
//             <h4>regionCode:{aqiData?.regionCode}</h4>
//           </div>

//           {aqiData?.indexes?.map((indexes) => (
//             <div className=" text-lg font-bold capitalize bg-white text-green-600 p-4 m-3 rounded-xl w-full">
//               <h3 className="text-black underline my-3">Indexes</h3>
//               <h5>
//                 indexescode:<span className="">{indexes?.code}</span>
//               </h5>
//               <h5>
//                 indexesdisplayName:
//                 <span className="">{indexes?.displayName}</span>
//               </h5>
//               <h5>indexesapi{indexes?.aqi}</h5>
//               <h5>indexescolorred:{indexes?.color?.red}</h5>
//               <h5>indexescolorgreen:{indexes?.color?.green}</h5>
//               <h5>indexescolorblue{indexes?.color?.blue}</h5>
//               <h5>indexescategory:{indexes?.category}</h5>
//               <h5>indexesdominantPollutant:{indexes?.dominantPollutant}</h5>
//             </div>
//           ))}
//           <div className="text-lg font-bold capitalize bg-white text-green-600 p-4 m-3 rounded-xl w-full">
//             {aqiData?.pollutants?.map((pollutants) => (
//               <div>
//                 <h3 className="underline my-4 text-black">pollutants </h3>
//                 <h5>code:{pollutants?.code}</h5>
//                 <h5>displayName:{pollutants?.displayName}</h5>
//                 <h5>fullName:{pollutants?.fullName}</h5>
//                 <h5>concentrationvalue:{pollutants?.concentration?.value}</h5>
//                 <h5>concentrationunits:{pollutants?.concentration?.units}</h5>
//                 <h5>
//                   additionalInfosources{pollutants?.additionalInfo?.sources}
//                 </h5>
//                 <h5>
//                   additionalInfoeffects{pollutants?.additionalInfo?.effects}
//                 </h5>
//                 <h5>category:{pollutants?.category}</h5>
//                 <h5>dominantPollutant:{pollutants?.dominantPollutant}</h5>
//               </div>
//             ))}
//           </div>
//           <div className="capitalize bg-white  p-6 m-3 rounded-xl w-full">
//             <p className="underline text-black my-3">healthRecommendations:</p>
//             <ul className="text-base font-semibold text-green-600">
//               <li className="my-3 list-disc">
//                 <p className="text-black underline my-2">generalPopulation:</p>
//                 {aqiData?.healthRecommendations?.generalPopulation}
//               </li>
//               <li className="my-3 list-disc">
//                 <p className="text-black underline my-2">elderly:</p>
//                 {aqiData?.healthRecommendations?.elderly}
//               </li>
//               <li className="my-3 list-disc">
//                 <p className="text-black underline my-2">
//                   lungDiseasePopulation:
//                 </p>
//                 {aqiData?.healthRecommendations?.lungDiseasePopulation}
//               </li>
//               <li className="my-3 list-disc">
//                 <p className="text-black underline my-2">
//                   heartDiseasePopulation:
//                 </p>
//                 {aqiData?.healthRecommendations?.heartDiseasePopulation}
//               </li>
//               <li className="my-3 list-disc">
//                 <p className="text-black underline my-2">athletes:</p>
//                 {aqiData?.healthRecommendations?.athletes}
//               </li>
//               <li className="my-3 list-disc">
//                 <p className="text-black underline my-2">pregnantWomen:</p>
//                 {aqiData?.healthRecommendations?.pregnantWomen}
//               </li>
//               <li className="my-3 list-disc">
//                 <p className="text-black underline my-3">children: </p>
//                 {aqiData?.healthRecommendations?.children}
//               </li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AQI;
