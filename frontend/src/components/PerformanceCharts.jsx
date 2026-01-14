import React from "react";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceCharts = ({ data }) => {
    if (!data || data.length === 0) return null;

    const labels = data.map((d) => `Cust ${d.customer_id}`);

    // Helper to create chart options
    const createOptions = (title) => ({
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: title },
        },
    });

    const waitTimeData = {
        labels,
        datasets: [
            {
                label: "Wait Time",
                data: data.map((d) => d.wait_time),
                backgroundColor: "rgba(255, 99, 132, 0.5)",
            },
        ],
    };

    const turnaroundTimeData = {
        labels,
        datasets: [
            {
                label: "Turnaround Time",
                data: data.map((d) => d.turnaround_time),
                backgroundColor: "rgba(53, 162, 235, 0.5)",
            },
        ],
    };

    const responseTimeData = {
        labels,
        datasets: [
            {
                label: "Response Time",
                data: data.map((d) => d.response_time),
                backgroundColor: "rgba(75, 192, 192, 0.5)",
            },
        ],
    };

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
            <div className="chart-container">
                <Bar options={createOptions("Wait Time per Customer")} data={waitTimeData} />
            </div>
            <div className="chart-container">
                <Bar options={createOptions("Turnaround Time per Customer")} data={turnaroundTimeData} />
            </div>
            <div className="chart-container">
                <Bar options={createOptions("Response Time per Customer")} data={responseTimeData} />
            </div>
        </div>
    );
};

export default PerformanceCharts;
