import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import "./index.css";
import Bookings from "./pages/Bookings";
import BookingsAtVenue from "./pages/BookingsAtVenue";
import CreateVenue from "./pages/CreateVenue";
import EditVenue from "./pages/EditVenue";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyVenues from "./pages/MyVenues";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import VenueDetail from "./pages/VenueDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="venues/:id" element={<VenueDetail />} />

          {/* Authenticated users */}
          <Route path="profile" element={<Profile />} />
          <Route path="bookings" element={<Bookings />} />

          {/* Venue Manager specific */}
          <Route path="venues/create" element={<CreateVenue />} />
          <Route path="venues/:id/edit" element={<EditVenue />} />
          <Route path="venues/:id/bookings" element={<BookingsAtVenue />} />
          <Route path="my-venues" element={<MyVenues />} />
        </Route>
      </Routes>
    </Router>
  );
}
