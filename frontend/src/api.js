const API_BASE = "http://127.0.0.1:8000/api";

export async function simulate(data) {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function simulatePriority(data) {
  const res = await fetch(`${API_BASE}/simulate/priority`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function queueingCalculate(data) {
  const res = await fetch(`${API_BASE}/queueing/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
