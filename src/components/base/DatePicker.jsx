import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DatePicker({
  selected,
  onChange,
  placeholderText,
  minDate,
}) {
  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      placeholderText={placeholderText}
      dateFormat="dd.MM.yyyy"
      minDate={minDate}
      className="w-full border border-light rounded px-4 py-2"
      calendarClassName="text-sm"
    />
  );
}
