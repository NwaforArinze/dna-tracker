import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/authService";

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const result = await adminLogin(email, password);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate("/admin/tests");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-4 py-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button className="w-full bg-blue-600 text-white py-2 rounded mt-2">
          Login
        </button>
      </form>
    </div>
  );
}
