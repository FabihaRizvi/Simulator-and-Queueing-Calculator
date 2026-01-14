import React, { useState } from "react";
import ResultsTable from "../components/ResultsTable";
import GanttChart from "../components/GanttChart";
import Measures from "../components/Measures";
import PerformanceCharts from "../components/PerformanceCharts";
import "../index.css";

const Simulator = () => {
  const [formData, setFormData] = useState({
    num_customers: 10,
    num_servers: 2,
    arrival_mean: 5.0,
    service_mean: 3.0,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log("Payload:", formData);

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Simulation Response:", data);
      setResults({
        results: data.results || [],
        gantt: data.gantt || [],
        average_wait_time: data.average_wait_time ?? 0,
        average_turnaround_time: data.average_turnaround_time ?? 0,
        average_response_time: data.average_response_time ?? 0,
        server_utilization: data.server_utilization ?? 0,
      });
    } catch (err) {
      console.error("Error fetching Simulator data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Simulator</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Number of Customers</label>
          <input
            type="number"
            name="num_customers"
            value={formData.num_customers}
            onChange={handleChange}
          />
          <label>Number of Servers</label>
          <input
            type="number"
            name="num_servers"
            value={formData.num_servers}
            onChange={handleChange}
          />
          {/* <label>Arrival Mean</label>
          <input
            type="number"
            name="arrival_mean"
            value={formData.arrival_mean}
            onChange={handleChange}
          /> */}
          {/* <label>Service Mean</label>
          <input
            type="number"
            name="service_mean"
            value={formData.service_mean}
            onChange={handleChange}
          /> */}
          <button type="submit" disabled={loading}>
            {loading ? "Simulating..." : "Run Simulation"}
          </button>
        </form>
      </div>

      {results && (
        <>
          <ResultsTable data={results.results} />
          <GanttChart
            data={results.gantt.map((task) => ({
              ...task,
              server: task.server_id,
            }))}
          />
          <Measures
            data={{
              average_wait_time: results.average_wait_time,
              average_turnaround_time: results.average_turnaround_time,
              average_response_time: results.average_response_time,
              server_utilization: results.server_utilization,
            }}
          />
          <PerformanceCharts data={results.results} />
        </>
      )}
    </div>
  );
};

export default Simulator;
