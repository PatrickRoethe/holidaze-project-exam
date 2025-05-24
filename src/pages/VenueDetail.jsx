import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/base/Button";
import DatePicker from "../components/base/DatePicker";
import ErrorMessage from "../components/base/ErrorMessage";
import Loader from "../components/base/Loader";

export default function VenueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);
  const [feedback, setFeedback] = useState("");
  const [showBooking, setShowBooking] = useState(false);
  const [showDates, setShowDates] = useState(false);
  const [guestError, setGuestError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    async function fetchVenue() {
      try {
        const response = await axios.get(
          `https://v2.api.noroff.dev/holidaze/venues/${id}?_bookings=true`
        );
        setVenue(response.data.data);
      } catch (err) {
        setError("Failed to load venue details.");
      } finally {
        setLoading(false);
      }
    }

    fetchVenue();
  }, [id]);

  const bookedDates = (venue?.bookings || []).filter(
    (b) => new Date(b.dateFrom) <= new Date(b.dateTo)
  );

  const isRangeBooked = (from, to) => {
    const start = from?.getTime();
    const end = to?.getTime();
    if (!start || !end) return false;

    return bookedDates.some((b) => {
      const bookedFrom = new Date(b.dateFrom).getTime();
      const bookedTo = new Date(b.dateTo).getTime();
      return (
        (start >= bookedFrom && start <= bookedTo) ||
        (end >= bookedFrom && end <= bookedTo) ||
        (start <= bookedFrom && end >= bookedTo)
      );
    });
  };

  // ✅ Direkte validering når én av datoene endres
  useEffect(() => {
    if (dateFrom && dateTo && isRangeBooked(dateFrom, dateTo)) {
      setDateError("Selected dates overlap with existing bookings.");
    } else if (dateFrom && !dateTo && isRangeBooked(dateFrom, dateFrom)) {
      setDateError("Selected start date is already booked.");
    } else if (!dateFrom && dateTo && isRangeBooked(dateTo, dateTo)) {
      setDateError("Selected end date is already booked.");
    } else {
      setDateError("");
    }
  }, [dateFrom, dateTo]);

  function handleGuestsChange(e) {
    const value = parseInt(e.target.value);
    setGuests(value);
    setGuestError(
      value > venue.maxGuests ? `Max ${venue.maxGuests} guests allowed.` : ""
    );
  }

  async function handleBooking() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    if (guestError || dateError || !dateFrom || !dateTo) return;

    try {
      await axios.post(
        "https://v2.api.noroff.dev/holidaze/bookings",
        {
          dateFrom: dateFrom.toISOString(),
          dateTo: dateTo.toISOString(),
          guests,
          venueId: id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFeedback("Booking successful!");
    } catch (err) {
      setFeedback("Booking failed. Please try again.");
    }
  }

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;
  if (!venue) return null;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <img
        src={venue.media[0]?.url || "/placeholder.jpg"}
        alt={venue.name}
        className="w-full object-cover rounded aspect-[3/2]"
      />

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{venue.name}</h1>
        <p className="text-sm text-dark">@{venue.owner?.name}</p>
        <p className="text-base">{venue.description}</p>
        <p className="text-gray-600">
          {venue.location.city}, {venue.location.country}
        </p>
        <p className="text-primary font-semibold">{venue.price} NOK / night</p>
      </div>

      <Button onClick={() => setShowBooking((prev) => !prev)}>
        {showBooking ? "Hide Booking" : "Book Now"}
      </Button>

      {showBooking && (
        <div className="mt-4 space-y-4 border p-4 rounded bg-light">
          <h2 className="text-xl font-semibold">Booking</h2>

          <div className="space-y-2">
            <label className="block text-sm">
              From:
              <DatePicker
                selected={dateFrom}
                onChange={setDateFrom}
                placeholderText="Select start date"
                minDate={new Date()}
              />
            </label>
            <label className="block text-sm">
              To:
              <DatePicker
                selected={dateTo}
                onChange={setDateTo}
                placeholderText="Select end date"
                minDate={dateFrom || new Date()}
              />
            </label>
            <label className="block text-sm">
              Guests (Max: {venue.maxGuests}):
              <input
                type="number"
                value={guests}
                min={1}
                max={venue.maxGuests}
                onChange={handleGuestsChange}
                className="w-full border border-light rounded px-4 py-2"
              />
            </label>

            {guestError && <ErrorMessage message={guestError} />}
            {dateError && <ErrorMessage message={dateError} />}
          </div>

          <Button
            onClick={handleBooking}
            disabled={!!guestError || !!dateError}
          >
            Confirm Booking
          </Button>

          {feedback && (
            <p
              className={`text-sm ${
                feedback.includes("successful") ? "text-success" : "text-error"
              }`}
            >
              {feedback}
            </p>
          )}
        </div>
      )}

      <div className="mt-6">
        <p className="font-medium">
          {bookedDates.length} unavailable date ranges{" "}
          <button
            className="text-primary underline"
            onClick={() => setShowDates((prev) => !prev)}
          >
            {showDates ? "Hide" : "Show"}
          </button>
        </p>
        {showDates && (
          <div className="max-h-48 overflow-y-auto mt-2 border rounded bg-white p-3 text-sm">
            <ul className="list-disc pl-4 space-y-1">
              {bookedDates.map((b, i) => {
                const from = new Date(b.dateFrom).toLocaleDateString("no-NO");
                const to = new Date(b.dateTo).toLocaleDateString("no-NO");
                return (
                  <li key={i}>
                    {from} – {to}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
