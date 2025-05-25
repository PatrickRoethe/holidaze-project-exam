import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from "../components/base/ErrorMessage";
import Loader from "../components/base/Loader";
import VenueForm from "../components/Venue/VenueForm";
import useAuth from "../hooks/useAuth";

export default function EditVenue() {
  const { id } = useParams(); // optional
  const { user, accessToken, apiKey } = useAuth();
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch one venue by ID (from URL)
  useEffect(() => {
    if (id) {
      setLoading(true);
      fetch(`https://v2.api.noroff.dev/holidaze/venues/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load venue details.");
          return res.json();
        })
        .then((data) => setSelectedVenue(data.data))
        .catch((err) => setApiError(err.message))
        .finally(() => setLoading(false));
    }
  }, [id, accessToken, apiKey]);

  // If no ID, fetch all venues owned by this user
  useEffect(() => {
    if (!id && user?.name && accessToken && apiKey) {
      fetch(`https://v2.api.noroff.dev/holidaze/profiles/${user.name}/venues`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load venues");
          return res.json();
        })
        .then((data) => setVenues(data.data))
        .catch((err) => setApiError(err.message));
    }
  }, [id, user?.name, accessToken, apiKey]);

  const handleSelectVenue = (venueId) => {
    const venue = venues.find((v) => v.id === venueId);
    if (venue) setSelectedVenue(venue);
  };

  const handleUpdateVenue = async (formData) => {
    if (!selectedVenue) return;
    setApiError("");
    setApiSuccess("");
    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${selectedVenue.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update venue.");
      }
      const result = await res.json();
      setApiSuccess("Venue successfully updated.");
      setSelectedVenue(result.data);
    } catch (err) {
      setApiError(err.message);
    }
  };

  const handleDeleteVenue = async () => {
    if (!selectedVenue) return;
    const confirm = window.confirm(
      `Are you sure you want to delete "${selectedVenue.name}"?`
    );
    if (!confirm) return;
    setApiError("");
    setApiSuccess("");
    try {
      const res = await fetch(
        `https://v2.api.noroff.dev/holidaze/venues/${selectedVenue.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete venue.");
      }
      setApiSuccess("Venue successfully deleted.");
      setSelectedVenue(null);
    } catch (err) {
      setApiError(err.message);
    }
  };

  if (loading) return <Loader />;
  if (!selectedVenue && id && apiError)
    return <ErrorMessage message="Failed to load venue details." />;

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Edit Venue</h1>
      <VenueForm
        initialData={selectedVenue}
        venuesList={!id ? venues : null}
        onSelectVenue={!id ? handleSelectVenue : null}
        submitLabel="Edit Venue"
        onSubmit={handleUpdateVenue}
        onDelete={handleDeleteVenue}
        apiError={apiError}
        apiSuccess={apiSuccess}
      />
    </div>
  );
}
