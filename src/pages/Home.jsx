import axios from "axios";
import { useEffect, useState } from "react";
import Button from "../components/base/Button";
import ErrorMessage from "../components/base/ErrorMessage";
import Loader from "../components/base/Loader";
import VenueCard from "../components/Venue/VenueCard";

export default function Home() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    async function fetchVenues() {
      try {
        const response = await axios.get(
          `https://v2.api.noroff.dev/holidaze/venues?limit=100&_owner=true`
        );
        setVenues(response.data.data);
      } catch (err) {
        setError("Failed to fetch venues");
      } finally {
        setLoading(false);
      }
    }

    fetchVenues();
  }, []);

  const filteredVenues = venues
    .filter((venue) => venue.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const paginatedVenues = filteredVenues.slice(
    (page - 1) * limit,
    page * limit
  );

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 mt-8 space-y-6">
      {/* Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <input
          type="text"
          placeholder="Search venues..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full md:w-1/2 border border-light rounded px-4 py-2"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full md:w-1/4 border border-light rounded px-4 py-2"
        >
          <option value="default">Sort by</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name">Name: A–Z</option>
        </select>
      </div>

      {/* Venue grid */}
      {paginatedVenues.length === 0 ? (
        <p className="text-gray-500 mt-4">No venues found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginatedVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
        <Button
          onClick={() => setPage(1)}
          disabled={page === 1}
          variant="primary"
          className="w-full sm:w-auto"
        >
          Første side
        </Button>
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Forrige
        </Button>
        <span className="text-sm font-medium px-2">Side {page}</span>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={page * limit >= filteredVenues.length}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          Neste
        </Button>
      </div>
    </div>
  );
}
