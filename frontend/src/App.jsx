import { useState } from "react";
import { calculateQueue } from "./api";
import "./index.css";

export default function App() {
  const [servers, setServers] = useState(1);
  const [customers, setCustomers] = useState(5);
  const [arrivalRate, setArrivalRate] = useState(2);
  const [serviceRate, setServiceRate] = useState(3);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
              num_servers: parseInt(servers),
              num_customers: parseInt(customers),
              arrival_mean: parseFloat(arrivalRate),
              service_mean: parseFloat(serviceRate),
            };

      const res = await calculateQueue(data);
      setResult(res);
    } catch (err) {
      alert("Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>Queuing System Calculator</h1>
      <form onSubmit={handleSubmit}>
        <label>Servers:</label>
        <input type="number" value={servers} onChange={(e) => setServers(e.target.value)} />

        <label>Customers:</label>
        <input type="number" value={customers} onChange={(e) => setCustomers(e.target.value)} />

        <label>Arrival Rate:</label>
        <input type="number" step="0.1" value={arrivalRate} onChange={(e) => setArrivalRate(e.target.value)} />

        <label>Service Rate:</label>
        <input type="number" step="0.1" value={serviceRate} onChange={(e) => setServiceRate(e.target.value)} />

        <button type="submit" disabled={loading}>
          {loading ? "Calculating..." : "Calculate"}
        </button>
      </form>

      {result && (
        <div className="results">
          <h2>Results</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
