import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Holidaze
        </Link>
        <div className="space-x-4">
          <Link to="/my-venues" className="hover:underline">
            My Venues
          </Link>
          <Link to="/profile" className="hover:underline">
            Profile
          </Link>
          <Link to="/bookings" className="hover:underline">
            My Bookings
          </Link>
          <Link to="/venues/create" className="hover:underline">
            Create Venue
          </Link>
          <Link to="/login" className="hover:underline">
            Login
          </Link>
          <Link to="/register" className="hover:underline">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
