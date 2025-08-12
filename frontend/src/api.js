export const API_BASE = "http://127.0.0.1:8000";

export async function calculateQueue(data) {
  const response = await fetch(`${API_BASE}/api/simulate`,  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return await response.json();
}
