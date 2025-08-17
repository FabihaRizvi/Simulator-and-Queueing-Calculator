import React, { useState } from "react";
import ResultsTable from "../components/ResultsTable";
import GanttChart from "../components/GanttChart";
import Measures from "../components/Measures";
import "../index.css";

const PrioritySimulator = () => {
  const [formData, setFormData] = useState({
    numCustomers: 10,
    numServers: 2,
    priorityLevels: 3,
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
      const res = await fetch("http://127.0.0.1:8000/api/simulate/priority", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResults(data);
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
            name="numCustomers"
            value={formData.numCustomers}
            onChange={handleChange}
          />
          <label>Number of Servers</label>
          <input
            type="number"
            name="numServers"
            value={formData.numServers}
            onChange={handleChange}
          />
          <label>Priority Levels</label>
          <input
            type="number"
            name="priorityLevels"
            value={formData.priorityLevels}
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
        </>
      )}
    </div>
  );
};

export default PrioritySimulator;
