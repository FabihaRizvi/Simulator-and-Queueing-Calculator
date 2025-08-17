import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Simulator from "./pages/Simulator";
import PrioritySimulator from "./pages/PrioritySimulator";
import Queueing from "./pages/QueueingCalculator";
import "./index.css";


function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Simulator />} />
          <Route path="/priority" element={<PrioritySimulator />} />
          <Route path="/queueing" element={<Queueing />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
