import { Bar } from "react-chartjs-2";
import "./GanttChart.css"; 

export default function GanttChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = {
    labels: data.map((item, idx) => `Task ${idx + 1} (Server ${item.server})`),
    datasets: [
      {
        label: "Execution Time",
        data: data.map(item => item.end - item.start),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: {
        callbacks: {
          label: (context) => `Time: ${context.raw} units`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Execution Time" },
      },
      x: {
        title: { display: true, text: "Tasks / Servers" },
      },
    },
  };

  return (
    <div className="chart-container">
      <h3 className="chart-title">Gantt Chart</h3>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}
