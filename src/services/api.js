const API_URL = "https://api.smartdna.com.ng/api/v1";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("dna_token");

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  return data;
}
