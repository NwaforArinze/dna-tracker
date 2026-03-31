// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { login } from "../../services/authService";

// export default function AdminLoginPage() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("admin@dnacenter.com");
//   const [password, setPassword] = useState("admin123");
//   const [error, setError] = useState("");

//   function handleSubmit(e) {
//     e.preventDefault();
//     setError("");

//     const res = login(email, password);
//     if (!res.ok) {
//       setError(res.error);
//       return;
//     }

//     navigate("/admin/tests");
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4 py-10">
//         <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm">
//           <h1 className="text-2xl font-bold">Admin Login</h1>
//           <p className="mt-2 text-sm text-slate-600">
//             Sign in to manage tracking records.
//           </p>

//           <form onSubmit={handleSubmit} className="mt-6 space-y-4">
//             <div>
//               <label className="text-sm font-medium">Email</label>
//               <input
//                 className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-400"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">Password</label>
//               <input
//                 type="password"
//                 className="mt-2 w-full rounded-xl border px-4 py-3 outline-none focus:border-slate-400"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             {error && (
//               <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full rounded-xl bg-slate-900 py-3 text-white hover:bg-slate-800"
//             >
//               Login
//             </button>
//           </form>

//           <p className="mt-4 text-xs text-slate-500">
//             Demo login: admin@dnacenter.com / admin123
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
