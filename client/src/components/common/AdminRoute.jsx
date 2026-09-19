
import { Navigate, Outlet } from "react-router-dom";

function AdminRoute() {
  // Get the currently logged-in user
  const user = JSON.parse(
    localStorage.getItem("currentUser") || "null"
  );

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not an admin
  if (user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin is allowed
  return <Outlet />;
}

export default AdminRoute;

