import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/base/Button";
import ErrorMessage from "../components/base/ErrorMessage";
import Loader from "../components/base/Loader";
import useAuth from "../hooks/useAuth";

export default function MyVenues() {
  const { user, accessToken, apiKey } = useAuth();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user.name}/venues?_owner=true`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-Noroff-API-Key": apiKey,
            },
          }
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch venues");
        setVenues(data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (user?.name && accessToken && apiKey) {
      fetchVenues();
    }
  }, [user?.name, accessToken, apiKey]);

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Venues</h1>
      {venues.length === 0 ? (
        <p>You haven't created any venues yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="border rounded-md shadow p-3 flex flex-col justify-between"
            >
              <img
                src={
                  venue.media?.[0]?.url ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                alt={venue.name}
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-2">
                <h2 className="font-semibold">{venue.name}</h2>
                <p className="text-sm text-gray-600">
                  {venue.location?.city}, {venue.location?.country}
                </p>
                <p className="text-sm font-bold mt-1">
                  {venue.price} NOK / night
                </p>
              </div>
              <div className="mt-4 space-y-2">
                <Button
                  onClick={() => navigate(`/venues/${venue.id}/bookings`)}
                  variant="secondary"
                >
                  See Bookings
                </Button>
                <Button
                  onClick={() => navigate(`/venues/${venue.id}/edit`)}
                  variant="primary"
                >
                  Edit Venue
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
