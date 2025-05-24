import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function VenueManagerRoute({ children }) {
  const { user, isVenueManager } = useAuth();

  if (!user || !isVenueManager) {
    return <Navigate to="/login" />;
  }

  return children;
}
