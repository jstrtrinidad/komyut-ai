import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  
  /* TEMP FAKE AUTH */
  const isAuthenticated =
    localStorage.getItem("komyut_admin");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;