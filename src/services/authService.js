// const AUTH_KEY = "dna_admin_authed_v1";

// const DEMO_EMAIL = "admin@dnacenter.com";
// const DEMO_PASSWORD = "admin123";

// export function login(email, password) {
//   const ok =
//     String(email || "")
//       .trim()
//       .toLowerCase() === DEMO_EMAIL &&
//     String(password || "").trim() === DEMO_PASSWORD;

//   if (!ok) return { ok: false, error: "Invalid credentials" };

//   localStorage.setItem(AUTH_KEY, "true");
//   return { ok: true };
// }

// export function logout() {
//   localStorage.removeItem(AUTH_KEY);
// }

// export function isAuthed() {
//   return localStorage.getItem(AUTH_KEY) === "true";
// }
