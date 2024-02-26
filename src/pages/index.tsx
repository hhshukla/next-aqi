import Brezzometeraqi from "@/components/Brezzometer-aqi/Brezzometer-aqi";
import Openweatherapi from "@/components/OpenWeatherApi/openweatherapi";
// import Brezometer from "@/components/Brezometer/Brezometer";

export default function Home() {
  return (
    <>
      <title>AQI-Cipla</title>
      <Brezzometeraqi />
      {/* <Brezometer /> */}
      {/* <Openweatherapi /> */}
    </>
  );
}
