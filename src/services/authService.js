const AUTH_KEY = "dna_admin_auth";

// const ADMIN = {
//   email: "admin@dnacenter.com",
//   password: "admin123",
// };
function encode(value) {
  return btoa(value);
}

const ADMIN = {
  email: import.meta.env.VITE_ADMIN_EMAIL || "",
  password: import.meta.env.VITE_ADMIN_PASSWORD || "",
};

export function login(email, password) {
  if (!email || !password) {
    return { ok: false, error: "All fields are required" };
  }

  if (
    email.toLowerCase().trim() === ADMIN.email.toLowerCase().trim() &&
    encode(password) === ADMIN.password
  ) {
    const SESSION_DURATION = 1000 * 60 * 60; // 1 hour

    const session = {
      isAuth: true,
      expiresAt: Date.now() + SESSION_DURATION,
    };

    localStorage.setItem("dna_admin_auth", JSON.stringify(session));
    return { ok: true };
  }

  return { ok: false, error: "Invalid credentials" };
}

export function logout() {
  try {
    localStorage.removeItem("dna_admin_auth");
  } catch (err) {
    console.error("Logout error:", err);
  }
}

export function isAuthenticated() {
  const raw = localStorage.getItem(AUTH_KEY);

  if (!raw) return false;

  try {
    const session = JSON.parse(raw);

    // If expired → logout
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(AUTH_KEY);
      return false;
    }

    return session.isAuth === true;
  } catch {
    return false;
  }
}
