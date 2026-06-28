import { apiRequest } from "./api";

export async function adminLogin(email, password) {
  const response = await apiRequest("/auth/admin/signin", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (response.status === "success") {
    localStorage.setItem("dna_token", response.token);

    localStorage.setItem("dna_admin", JSON.stringify(response.data));

    return {
      ok: true,
      user: response.data,
    };
  }

  return {
    ok: false,
    error: response.message,
  };
}
export function logout() {
  localStorage.removeItem("dna_token");
  localStorage.removeItem("dna_admin");
}

export function isAuthenticated() {
  return !!localStorage.getItem("dna_token");
}

export function getCurrentUser() {
  const raw = localStorage.getItem("dna_admin");

  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
