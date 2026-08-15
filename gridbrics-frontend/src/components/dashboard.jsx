"use client";
import LineChart from "./LineChart";
import { useRef, useState } from "react";

const Dashboard = () => {
  const [forecastHorizon, setForecastHorizon] = useState(4);

  return (
    <div className="flex flex-col w-full rounded-md shadow-[0_0_6px_rgba(0,0,0,0.3)]">
      <h1 className="text-2xl font-bold mb-4 p-[0.5rem]">Power Generation</h1>

      <div className="flex-1 min-w-0 h-[20rem] p-[0.5rem]">
        <LineChart />
      </div>

      <div className="grid grid-cols-[2fr_2fr_2fr_1fr] gap-4 px-[0.5rem]">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="start-time"
          >
            Start Time:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="start-time"
            type="text"
            placeholder="Start Time"
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="end-time"
          >
            End Time:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="end-time"
            type="text"
            placeholder="End Time"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="forecast-horizon"
          >
            Forecast Horizon: {forecastHorizon} hrs
          </label>
          <input
            type="range"
            min="0"
            max="20"
            id="forecast-horizon"
            value={forecastHorizon}
            onChange={(e) => setForecastHorizon(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex justify-end items-end mb-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
            Fetch Forecast
          </button>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
