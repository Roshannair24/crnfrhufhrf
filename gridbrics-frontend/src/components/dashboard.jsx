"use client";
import DateTimePicker from "./DateTimePicker";
import LineChart from "./LineChart";
import { useRef, useState } from "react";
import styles from "./dashboard.module.css";
import PING from "@/lib/api";
import moment from "moment-timezone";

const Dashboard = () => {
  const [forecastHorizon, setForecastHorizon] = useState(4);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [error, setError] = useState(null);
  const [lineChartData, setLineChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Actual Power Generation",
        data: [],
        borderColor: "rgb(59, 130, 246)",
        tension: 0.3,
        fill: false,
      },
      {
        label: "Forecasted Power Generation",
        data: [],
        borderColor: "rgb(14, 216, 115)",
        tension: 0.3,
        fill: false,
      },
    ],
  });

  const generateLineChartData = ({
    forcastDataArr = [],
    prodDataArr = [],
    forecastHorizon = 0,
  }) => {
    const sortedForcastData = [...forcastDataArr].sort(
      (a, b) =>
        moment(a.publishTime).valueOf() - moment(b.publishTime).valueOf(),
    );
    const sortedProdData = [...prodDataArr].sort(
      (a, b) => moment(a.startTime).valueOf() - moment(b.startTime).valueOf(),
    );

    const dataMap = new Map();
    let lastProdStartTime = null;

    sortedProdData?.forEach((item) => {
      const {
        dataset,
        publishTime,
        startTime,
        settlementDate,
        settlementPeriod,
        fuelType,
        generation,
      } = item;

      if (!dataMap.has(startTime)) {
        dataMap.set(startTime, {
          prodGeneration: generation,
          forecastGeneration: null,
        });
      }

      lastProdStartTime = startTime;
    });

    sortedForcastData?.forEach((item) => {
      const { publishTime, startTime, generation } = item;

      const diffHours = moment(publishTime).diff(
        moment(startTime),
        "hours",
        true,
      );

      if (
        !dataMap.has(startTime) &&
        moment(startTime).isBefore(lastProdStartTime)
      ) {
        dataMap.set(startTime, {
          prodGeneration: null,
          forecastGeneration: generation,
        });
      }

      if (Number(diffHours) >= Number(forecastHorizon)) {
        if (dataMap.has(startTime)) {
          dataMap.get(startTime).forecastGeneration = generation;
        }
      }
    });

    const resetValues = {
      startTime: moment(startTime).utc(true).format(),
      endTime: moment(endTime).utc(true).format(),
    };

    const sortedArray = Array.from(dataMap)
      .sort(([keyA], [keyB]) => moment(keyA).valueOf() - moment(keyB).valueOf())
      .map(([key, value]) => ({
        startTime: key,
        forecastGeneration: value.forecastGeneration,
        prodGeneration: value.prodGeneration,
      }))
      .filter((item) =>
        moment(item.startTime).isBetween(
          resetValues.startTime,
          resetValues.endTime,
          null,
          "[]",
        ),
      );

    const dateSet = new Set();
    const labels = [];

    sortedArray.forEach((item) => {
      const formattedDate = moment.utc(item.startTime).format("YYYY-MM-DD");
      labels.push(moment.utc(item.startTime).format("YYYY-MM-DD HH:mm"));
      // if (!dateSet.has(formattedDate)) {
      //   dateSet.add(formattedDate);
      //   labels.push(moment.utc(item.startTime).format("YYYY-MM-DD HH:mm"));
      // } else {
      //   labels.push(moment.utc(item.startTime).format("HH:mm"));
      // }
    });

    const prodData = sortedArray.map((item) => item.prodGeneration);
    const forecastData = sortedArray.map((item) => item.forecastGeneration);

    const data = {
      labels,
      datasets: [
        {
          label: "Actual Power Generation",
          data: prodData,
          borderColor: "rgb(59, 130, 246)",
          tension: 0.3,
          fill: false,
        },
        {
          label: "Forecasted Power Generation",
          data: forecastData,
          borderColor: "rgb(14, 216, 115)",
          tension: 0.3,
          fill: false,
        },
      ],
    };

    return data;
  };

  const handleFetchForecast = async () => {
    if (!startTime || !endTime) {
      setError("Please select both start and end times.");
      return;
    }

    const queryParams = {
      startTime: moment(startTime)
        .utc(true)
        .subtract(forecastHorizon, "hours")
        .format(),
      endTime: moment(endTime).utc(true).format(),
    };

    const [forcastData, prodData] = await Promise.all([
      PING.getForecastDataApi({ payload: queryParams }),
      PING.getProdDataApi({ payload: queryParams }),
    ]);

    const data = generateLineChartData({
      forcastDataArr: forcastData?.data ?? [],
      prodDataArr: prodData?.data ?? [],
      forecastHorizon,
    });

    setLineChartData(data);

    error && setError(null);
  };

  return (
    <div className="flex flex-col w-full rounded-md shadow-[0_0_6px_rgba(0,0,0,0.3)]">
      <h1 className="text-2xl font-bold mb-4 p-[0.5rem]">
        National Historical Forecast
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_2fr_1fr] gap-4 px-[0.5rem]">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="start-time"
          >
            Start Time:
          </label>

          <DateTimePicker value={startTime} onChange={setStartTime} />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm mb-2"
            htmlFor="end-time"
          >
            End Time:
          </label>

          <DateTimePicker value={endTime} onChange={setEndTime} />
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
            max="48"
            step="0.25"
            id="forecast-horizon"
            value={forecastHorizon}
            onChange={(e) => setForecastHorizon(e.target.value)}
            className={`w-full ${styles.rangeInput}`}
          />
        </div>

        <div className="flex justify-end items-end mb-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-2xl w-full"
            onClick={handleFetchForecast}
          >
            Fetch Forecast
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm mb-4 px-[0.5rem]">{error}</div>
      )}

      <div className="flex-1 min-w-0 h-[20rem] p-[0.5rem]">
        <LineChart data={lineChartData} />
      </div>
    </div>
  );
};
export default Dashboard;
