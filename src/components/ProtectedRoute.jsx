import { Navigate } from "react-router-dom";
import { isAuthenticated, logout } from "../services/authService";

export default function ProtectedRoute({ children }) {
  const authed = isAuthenticated();

  if (!authed) {
    logout(); // cleanup expired session
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}
