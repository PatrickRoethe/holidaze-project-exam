import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Navbar() {
  const { user, isVenueManager, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Holidaze
        </Link>
        <div className="space-x-4">
          {user && (
            <>
              <Link to="/profile" className="hover:underline">
                Profile
              </Link>
              <Link to="/bookings" className="hover:underline">
                My Bookings
              </Link>
            </>
          )}

          {isVenueManager && (
            <>
              <Link to="/my-venues" className="hover:underline">
                My Venues
              </Link>
              <Link to="/venues/create" className="hover:underline">
                Create Venue
              </Link>
              <Link to="/venues/edit" className="hover:underline">
                Edit Venue
              </Link>
            </>
          )}

          {user ? (
            <button onClick={handleLogout} className="hover:underline">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
