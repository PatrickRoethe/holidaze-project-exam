import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/base/Button";
import useAuthStore from "../store/authStore";

export default function Navbar() {
  const { user, isVenueManager, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link to="/" className="text-3xl font-black tracking-tight text-accent">
          Holidaze
        </Link>

        {/* Mobilmeny-knapp */}
        <div className="md:hidden">
          <Button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "Close" : "Menu"}
          </Button>
        </div>

        {/* Desktop-nav */}
        <div className="hidden md:flex items-center space-x-8 text-lg font-medium">
          {user && (
            <>
              <Link to="/profile" className="text-accent hover:text-white">
                Profile
              </Link>
              <Link to="/bookings" className="text-accent hover:text-white">
                My Bookings
              </Link>
            </>
          )}

          {isVenueManager && (
            <>
              <Link to="/my-venues" className="text-accent hover:text-white">
                My Venues
              </Link>
              <Link
                to="/venues/create"
                className="text-accent hover:text-white"
              >
                Create
              </Link>
              <Link to="/venues/edit" className="text-accent hover:text-white">
                Edit
              </Link>
            </>
          )}

          {user ? (
            <Button onClick={handleLogout}>Logout</Button>
          ) : (
            <>
              <Link to="/login" className="text-accent hover:text-white">
                Login
              </Link>
              <Link to="/register" className="text-accent hover:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobil-meny */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 px-6 pb-6 flex flex-col space-y-4 text-base font-medium">
          {user && (
            <>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="text-accent hover:text-white"
              >
                Profile
              </Link>
              <Link
                to="/bookings"
                onClick={() => setMenuOpen(false)}
                className="text-accent hover:text-white"
              >
                My Bookings
              </Link>
            </>
          )}

          {isVenueManager && (
            <>
              <Link
                to="/my-venues"
                onClick={() => setMenuOpen(false)}
                className="text-accent hover:text-white"
              >
                My Venues
              </Link>
              <Link
                to="/venues/create"
                onClick={() => setMenuOpen(false)}
                className="text-accent hover:text-white"
              >
                Create
              </Link>
              <Link
                to="/venues/edit"
                onClick={() => setMenuOpen(false)}
                className="text-accent hover:text-white"
              >
                Edit
              </Link>
            </>
          )}

          {user ? (
            <Button onClick={handleLogout} className="w-full">
              Logout
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="text-accent hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
                className="text-accent hover:text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
