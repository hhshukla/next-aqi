import Image from "next/image";
import React from "react";
const weatherDataT = {
  weather: [
    {
      id: 711,
      main: "Smoke",
      description: "smoke",
      icon: "50n",
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
};

type aqiDataT = {
  dateTime: string;
  regionCode: string;
  indexes: [
    {},
    {
      code: string;
      displayName: string;
      aqi: number;
      aqiDisplay: string;
      color: rgbColor;
      category: string;
      dominantPollutant: string;
    }
  ];
};

type rgbColor = {
  red?: number;
  green?: number;
  blue?: number;
  alpha?: number;
};

const AqiButtons = ({
  aqiData,
  weatherData,
}: {
  aqiData: any;
  weatherData: any;
}) => {
  /** @see https://developers.google.com/maps/documentation/air-quality/reference/rest/v1/AirQualityIndex#color */
  const protoToCssColor = function (rgb_color: rgbColor) {
    var redFrac = rgb_color.red || 0.0;
    var greenFrac = rgb_color.green || 0.0;
    var blueFrac = rgb_color.blue || 0.0;
    var red = Math.floor(redFrac * 255);
    var green = Math.floor(greenFrac * 255);
    var blue = Math.floor(blueFrac * 255);

    // if (!("alpha" in rgb_color)) {
    //   return rgbToCssColor(red, green, blue);
    // }

    var alphaFrac = rgb_color?.alpha || 0.0;
    var rgbParams = [red, green, blue].join(",");
    console.log("RGB Color:", rgbParams);
    //return gradient string
    // conic-gradient( from var(--gradient-angle), clr-1, clr-2, clr-3, clr-3, clr-2, clr-1) border-box,conic-gradient(white, white) padding-box;
    let gradientString = "conic-gradient( from var(--gradient-angle), ";
    const colors = [];
    for (let i = 1; i < 4; i++) {
      const darkenedRed = Math.round(red * (1 - 0.2 * i));
      const darkenedGreen = Math.round(green * (1 - 0.2 * i));
      const darkenedBlue = Math.round(blue * (1 - 0.2 * i));
      var darkRgbParams = [darkenedRed, darkenedGreen, darkenedBlue].join(",");

      colors.push(["rgba(", darkRgbParams, ",", alphaFrac || 1, ")"].join(""));
    }

    gradientString += colors.join(",") + "," + colors.reverse().join(",");
    gradientString += ") border-box,conic-gradient(white, white) padding-box";

    return gradientString;
    // return ["rgba(", rgbParams, ",", alphaFrac, ")"].join("");
  };

  return (
    <div className="w-fit basis-1/3 flex flex-col items-center">
      <h2 className="text-2xl text-center">{aqiData.indexes[1].category}</h2>
      {/* --- button border div --- */}
      <div
        className="animated-button w-fit m-6"
        style={{ background: protoToCssColor(aqiData.indexes[1].color) }}
      >
        {/* --- aqi data --- */}
        <div className="bg-white text-black w-full h-full rounded-lg flex p-5 items-center">
          <div className="flex text-3xl font-bold mr-4">
            <h4 className="mr-2">AQI</h4>
            <span>{aqiData.indexes[1].aqi}</span>
            {/* --- Image --- */}
          </div>
          {/* ---- Location Weather ---- */}
          <div>
            <div className="text-lg flex items-center">{weatherData?.name}</div>
            <div className="flex text-2xl">
              <p className="flex items-center">
                {(weatherData.main.temp.toFixed(0) - 273).toString() + " °C"}
              </p>
              <Image
                src={`/Images/production/fill/openweathermap/${weatherData.weather[0].icon}.svg`}
                alt={weatherData.weather[0].id.toString()}
                width={40}
                height={40}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AqiButtons;
