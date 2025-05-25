import axios from "axios";
import { useEffect, useState } from "react";
import ErrorMessage from "../components/base/ErrorMessage";
import Loader from "../components/base/Loader";
import BookingCard from "../components/booking/BookingCard";
import useAuth from "../hooks/useAuth";
import useProfileStore from "../store/profileStore";

export default function Bookings() {
  const { user, accessToken, apiKey } = useAuth();
  const { profile, fetchProfile, loading, error } = useProfileStore();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (user?.name && accessToken && apiKey) {
      fetchProfile({ name: user.name, accessToken, apiKey });
    }
  }, [user?.name, accessToken, apiKey, fetchProfile]);

  const today = new Date();

  if (loading || !profile?.bookings) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  const sortedBookings = [...profile.bookings].sort(
    (a, b) => new Date(a.dateFrom) - new Date(b.dateFrom)
  );

  const upcoming = sortedBookings.filter(
    (booking) => new Date(booking.dateFrom) > today
  );
  const completed = sortedBookings.filter(
    (booking) => new Date(booking.dateTo) < today
  );

  const currentList = activeTab === "upcoming" ? upcoming : completed;

  async function handleDeleteBooking(id) {
    const confirm = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`https://v2.api.noroff.dev/holidaze/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      });

      fetchProfile({ name: user.name, accessToken, apiKey });
    } catch (err) {
      console.error("Failed to delete booking:", err);
      setDeleteError("Failed to delete booking. Please try again.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your bookings</h1>

      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 rounded ${
            activeTab === "upcoming"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`px-4 py-2 rounded ${
            activeTab === "completed"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Completed
        </button>
      </div>

      {deleteError && <ErrorMessage message={deleteError} />}

      {currentList.length === 0 ? (
        <p className="text-gray-500">
          No {activeTab === "upcoming" ? "upcoming" : "completed"} bookings.
        </p>
      ) : (
        <div className="space-y-4">
          {currentList.map((booking) => (
            <BookingCard
              key={booking.id}
              title={booking.venue?.name}
              image={booking.venue?.media?.[0]?.url}
              dateFrom={new Date(booking.dateFrom).toLocaleDateString("no-NO")}
              dateTo={new Date(booking.dateTo).toLocaleDateString("no-NO")}
              guests={booking.guests}
              host={booking.venue?.owner?.name}
              onDelete={
                activeTab === "upcoming"
                  ? () => handleDeleteBooking(booking.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
