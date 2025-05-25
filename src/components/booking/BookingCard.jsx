import Button from "../base/Button";
import Card from "../base/Card";

export default function BookingCard({
  title,
  image,
  dateFrom,
  dateTo,
  guests,
  host,
  onDelete,
}) {
  return (
    <Card className="flex flex-col gap-2 overflow-hidden">
      {image && (
        <img
          src={image}
          alt={title}
          className="rounded w-full aspect-video object-cover"
        />
      )}
      <div className="space-y-1">
        <h2 className="font-semibold text-lg">{title}</h2>
        <p className="text-sm text-dark">From: {dateFrom}</p>
        <p className="text-sm text-dark">To: {dateTo}</p>
        <p className="text-sm text-dark">Guests: {guests}</p>
        {host && (
          <p className="text-sm text-dark">
            Booked at venue by: <span className="font-semibold">@{host}</span>
          </p>
        )}
        {onDelete && (
          <div className="mt-2">
            <Button variant="error" onClick={onDelete}>
              Cancel Booking
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
