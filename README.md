# Simulator and Queueing Calculator

A full-stack web application designed to simulate queueing systems and calculate theoretical performance measures. This project features a **FastAPI** backend for powerful simulation logic and a **React** frontend for interactive visualizations.

## Features

### 1. General Simulator (FCFS)
- Simulates a Multi-Server queueing system using **First-Come-First-Served (FCFS)** scheduling.
- **Inputs**: Number of Customers, Number of Servers, Mean Arrival Time, Mean Service Time.
- **Outputs**:
  - Detailed table of Arrival, Start, End, Wait, and Turnaround times.
  - **Gantt Chart** visualizing server occupancy over time.
  - **Performance Charts** for Wait Time, Response Time, and Turnaround Time per customer.
  - Aggregated performance measures (Average Wait Time, Utilization, etc.).

### 2. Priority Simulator
- Simulates a queueing system where customers have assigned priority levels.
- **Logic**: Non-preemptive priority scheduling (Higher priority gets served first).
- **Features**:
  - Supports variable priority levels.
  - Visualizes how priority affects individual wait times and overall system efficiency.
  - Includes Gantt charts and specific performance metrics.

### 3. Queueing Calculator (M/M/c)
- Calculates theoretical performance metrics for an **M/M/c** queue (Markovian Arrival, Markovian Service, c Servers).
- **Outputs**:
  - Server Utilization ($\rho$)
  - Probability of 0 customers in system ($P_0$)
  - Probability of waiting ($P_w$)
  - Average Queue Length ($L_q$) & Number in System ($L$)
  - Average Wait Time ($W_q$) & Time in System ($W$)

## Tech Stack

- **Backend**: Python, FastAPI, Uvicorn
- **Frontend**: React.js, Vite, Chart.js, React-Chartjs-2
- **Styling**: Vanilla CSS

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js & npm

### 1. Backend Setup
Navigate to the `backend` directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Start the server:
> **Note**: Run this command from the `backend` folder.

```bash
python -m uvicorn app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

### 2. Frontend Setup
Navigate to the `frontend` directory and install dependencies:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Usage
1. Open the frontend URL.
2. Choose a tool from the navigation bar (**Simulator**, **Priority**, or **Queueing**).
3. Enter the required parameters in the form.
4. Click **Run Simulation** or **Calculate**.
5. View the generated tables and charts below the form.

---
**Created by**: Fabiha Rizvi
