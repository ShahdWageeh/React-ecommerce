import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = useSelector((s) => s.auth.token);
  const user = useSelector((s) => s.auth.user);
  const googleUser = useSelector((s) => s.auth.googleUser);
  const location = useLocation();

  // Treat Firebase Google login as "signed in" for UI access,
  // but keep `token` reserved for Route API-protected actions.
  if (!token && !user && !googleUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

