import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from "../components/base/ErrorMessage";
import Loader from "../components/base/Loader";
import useAuth from "../hooks/useAuth";

export default function BookingsAtVenue() {
  const { id } = useParams();
  const { user, accessToken, apiKey } = useAuth();
  const [venue, setVenue] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch venue to verify ownership
  useEffect(() => {
    async function fetchVenue() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch venue");
        if (data.data.owner?.name !== user.name) {
          throw new Error("You are not the owner of this venue.");
        }
        setVenue(data.data);
      } catch (err) {
        setError(err.message);
      }
    }

    if (id && accessToken && apiKey && user?.name) {
      fetchVenue();
    }
  }, [id, accessToken, apiKey, user?.name]);

  // Fetch bookings for the venue
  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch(
          `https://v2.api.noroff.dev/holidaze/bookings?_venue=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to fetch bookings");

        // Filter bookings to only include those for this venue
        const filtered = data.data.filter((booking) => booking.venue.id === id);
        setBookings(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (venue) {
      fetchBookings();
    }
  }, [venue, accessToken, apiKey, id]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!venue) return null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Bookings for “{venue.name}”</h1>
      {bookings.length === 0 ? (
        <p>No bookings for this venue yet.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="border rounded shadow p-4 flex items-center justify-between gap-4"
            >
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {new Date(booking.dateFrom).toLocaleDateString()} –{" "}
                  {new Date(booking.dateTo).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  Guests: <strong>{booking.guests}</strong>
                </p>
                <p className="text-sm mt-1">
                  Booked by:{" "}
                  <span className="font-semibold">
                    @{booking.customer?.name}
                  </span>
                </p>
              </div>
              {booking.customer?.avatar?.url && (
                <img
                  src={booking.customer.avatar.url}
                  alt={booking.customer.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
