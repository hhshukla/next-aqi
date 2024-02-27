import Brezzometeraqi from "@/components/Brezzometer-aqi/Brezzometer-aqi";
import Openweatherapi from "@/components/OpenWeatherApi/openweatherapi";
import Weatherchannel from "@/components/Weatherchannel/Weatherchannel";
// import Brezometer from "@/components/Brezometer/Brezometer";

export default function Home() {
  return (
    <>
      <title>AQI-Cipla Breathfree</title>
      {/* <Brezzometeraqi /> */}
      {/* <Brezometer /> */}
      {/* <Weatherchannel /> */}
      <Openweatherapi />
    </>
  );
}
