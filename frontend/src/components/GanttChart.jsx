import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import "./GanttChart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function GanttChart({ data }) {
  if (!data || data.length === 0) return null;

  const labels = data.map(
    (item, idx) => `Task ${idx + 1} (Server ${item.server})`
  );

  const chartData = {
  labels: data.map((item, idx) => `Task ${idx + 1} (Server ${item.server})`),
  datasets: [
    {
      label: "Start Time",
      data: data.map(item => item.start_time),
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    },
    {
      label: "Duration",
      data: data.map(item => item.end_time - item.start_time),
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    },
  ],
};


  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => {
            const idx = context.dataIndex;
            const task = data[idx];
           return `Start: ${task.start_time.toFixed(2)}, End: ${task.end_time.toFixed(2)}, Duration: ${(task.end_time - task.start_time).toFixed(2)}`;
          },
        },
      },
    },
    indexAxis: "y", 
    scales: {
      x: {
        stacked: true,
        title: { display: true, text: "Time Units" },
      },
      y: {
        stacked: true,
        title: { display: true, text: "Customers / Servers" },
      },
    },
  };
  return (
    <div className="chart-container">
      <h3 className="chart-title">Gantt Chart</h3>
      <Bar key={JSON.stringify(data)} data={chartData} options={chartOptions} />
    </div>
  );
}
