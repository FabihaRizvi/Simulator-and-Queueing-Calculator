import React, { useState } from "react";
import Measures from "../components/Measures";
import "../index.css";

const QueueingCalculator = () => {
  const [formData, setFormData] = useState({
    arrival_rate: 5,
    service_rate: 7,
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
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/api/queueing/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResults({
        utilization: data.utilization,
        P0: data.P0,
        Pw: data.Pw,
        Lq: data.Lq,
        Wq: data.Wq,
        W: data.W,
        L: data.L,
      });
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
            name="arrival_rate"
            value={formData.arrival_rate}
            onChange={handleChange}
          />
          <label>Service Rate (μ)</label>
          <input
            type="number"
            name="service_rate"
            value={formData.service_rate}
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

      {results && <Measures data={results} />}
    </div>
  );
};

export default QueueingCalculator;
