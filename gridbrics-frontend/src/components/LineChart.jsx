"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

const options = {
  responsive: true,
  spanGaps: true,
  //    maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: false },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Target Time End (UTC)",
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Power Generation (MW)",
      },
    },
  },
};

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Actual Power Generation",
      data: [120, 190, 150, 250, 220, 300],
      borderColor: "rgb(59, 130, 246)",
      tension: 0.3,
      fill: false,
    },
    {
      label: "Forecasted Power Generation",
      data: [120, 200, 150, 200, 220, 300],
      borderColor: "rgb(14, 216, 115)",
      tension: 0.3,
      fill: false,
    },
  ],
};

export default function LineChart({ data }) {
  return <Line data={data} options={options} />;
}
