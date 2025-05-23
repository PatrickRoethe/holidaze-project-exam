import Card from "../base/Card";

export default function VenueCard({ venue }) {
  const { name, media, location, price } = venue;

  return (
    <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 ease-in-out">
      <img
        src={media[0]?.url || "/placeholder.jpg"}
        alt={name}
        className="w-full h-48 object-cover rounded"
      />
      <h2 className="text-lg font-semibold mt-2 line-clamp-1">{name}</h2>
      <p className="text-sm text-gray-600">
        {location?.city || "Unknown"}, {location?.country || "Unknown"}
      </p>
      <p className="text-primary font-bold">{price} NOK / night</p>
    </Card>
  );
}
