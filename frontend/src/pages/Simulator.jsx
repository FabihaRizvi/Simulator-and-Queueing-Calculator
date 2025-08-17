import React, { useState } from "react";
import ResultsTable from "../components/ResultsTable";
import GanttChart from "../components/GanttChart";
import Measures from "../components/Measures";
import "../index.css";

const Simulator = () => {
  const [formData, setFormData] = useState({
    num_customers: 10,
    num_servers: 2,
    arrival_mean: 5,
    service_mean: 3,
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
        const payload = {
        num_customers: Number(formData.num_customers),
        num_servers: Number(formData.num_servers),
        arrival_mean: Number(formData.arrival_mean),
        service_mean: Number(formData.service_mean),
      };

      console.log("Payload:", payload);

      const res = await fetch("http://127.0.0.1:8000/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResults(data);
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
          <button type="submit" disabled={loading}>
            {loading ? "Simulating..." : "Run Simulation"}
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

export default Simulator;
