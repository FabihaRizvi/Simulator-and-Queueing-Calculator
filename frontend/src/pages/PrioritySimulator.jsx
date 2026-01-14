import React, { useState } from "react";
import ResultsTable from "../components/ResultsTable";
import GanttChart from "../components/GanttChart";
import Measures from "../components/Measures";
import PerformanceCharts from "../components/PerformanceCharts";
import "../index.css";

const PrioritySimulator = () => {
  const [formData, setFormData] = useState({
    num_customers: 10,
    num_servers: 2,
    arrival_mean: 5.0,
    service_mean: 4.0,
    // priorities: [], // Optional
    max_priority: 3,
    priority_low_is_high: true,
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/simulate/priority`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      // Transform backend response to what components expect
      setResults({
        table: data.results || [],
        gantt: (data.gantt || []).map(g => ({ ...g, server: g.server_id })),
        measures: {
          average_wait_time: data.average_wait_time,
          average_turnaround_time: data.average_turnaround_time,
          average_response_time: data.average_response_time,
          server_utilization: data.server_utilization
        }
      });
    } catch (err) {
      console.error("Error fetching Priority Simulator data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Priority Simulator</h1>
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
          <label>Max Priority Level</label>
          <input
            type="number"
            name="max_priority"
            value={formData.max_priority}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Simulating..." : "Run Priority Simulation"}
          </button>
        </form>
      </div>

      {results && (
        <>
          <ResultsTable data={results.table} />
          <GanttChart data={results.gantt} />
          <Measures data={results.measures} />
          <PerformanceCharts data={results.table} />
        </>
      )}
    </div>
  );
};

export default PrioritySimulator;
