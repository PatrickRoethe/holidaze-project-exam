import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import PrivateRoute from "./components/Auth/PrivateRoute";
import VenueManagerRoute from "./components/Auth/VenueManagerRoute";
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
import useAuthStore from "./store/authStore";

export default function App() {
  useEffect(() => {
    useAuthStore.getState().initAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Order matters here! */}
          <Route
            path="venues/create"
            element={
              <VenueManagerRoute>
                <CreateVenue />
              </VenueManagerRoute>
            }
          />
          <Route
            path="venues/edit"
            element={
              <VenueManagerRoute>
                <EditVenue />
              </VenueManagerRoute>
            }
          />
          <Route
            path="venues/:id/edit"
            element={
              <VenueManagerRoute>
                <EditVenue />
              </VenueManagerRoute>
            }
          />
          <Route
            path="venues/:id/bookings"
            element={
              <VenueManagerRoute>
                <BookingsAtVenue />
              </VenueManagerRoute>
            }
          />
          <Route path="venues/:id" element={<VenueDetail />} />

          {/* Authenticated users */}
          <Route
            path="profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="bookings"
            element={
              <PrivateRoute>
                <Bookings />
              </PrivateRoute>
            }
          />
          <Route
            path="my-venues"
            element={
              <VenueManagerRoute>
                <MyVenues />
              </VenueManagerRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}
