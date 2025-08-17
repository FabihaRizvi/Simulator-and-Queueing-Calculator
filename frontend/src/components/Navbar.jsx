import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">Simulator App</h2>
      <ul className="nav-links">
        <li><Link to="/">Simulator</Link></li>
        <li><Link to="/priority">Priority Simulator</Link></li>
        <li><Link to="/queueing">Queueing Calculator</Link></li>
      </ul>
    </nav>
  );
}
