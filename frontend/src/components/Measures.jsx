import React from "react";
import "./Measures.css"; 

export default function Measures({ stats }) {
  if (!stats) return null;

  return (
    <div className="measures-container">
      <h3 className="measures-title">Performance Measures</h3>
      <ul className="measures-list">
        {Object.entries(stats).map(([key, value]) => (
          <li key={key} className="measures-item">
            <span className="measures-key">{key}</span>:{" "}
            <span className="measures-value">{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
