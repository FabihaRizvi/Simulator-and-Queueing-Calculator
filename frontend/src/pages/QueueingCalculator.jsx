import React, { useState } from "react";
import Measures from "../components/Measures";
import "../index.css";

const QueueingCalculator = () => {
  const [formData, setFormData] = useState({
    arrivalRate: 5,
    serviceRate: 7,
    servers: 2,
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
      const res = await fetch("http://127.0.0.1:8000/api/queueing/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Error fetching Queueing Calculator data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Queueing Calculator</h1>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <label>Arrival Rate (λ)</label>
          <input
            type="number"
            name="arrivalRate"
            value={formData.arrivalRate}
            onChange={handleChange}
          />
          <label>Service Rate (μ)</label>
          <input
            type="number"
            name="serviceRate"
            value={formData.serviceRate}
            onChange={handleChange}
          />
          <label>Servers (c)</label>
          <input
            type="number"
            name="servers"
            value={formData.servers}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Calculating..." : "Calculate"}
          </button>
        </form>
      </div>

      {results && <Measures data={results.measures} />}
    </div>
  );
};

export default QueueingCalculator;
