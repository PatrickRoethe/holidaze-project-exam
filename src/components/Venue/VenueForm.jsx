import { useEffect, useState } from "react";
import Button from "../base/Button";

function VenueForm({
  initialData = null,
  submitLabel = "Submit",
  onSubmit,
  onDelete,
  venuesList = null,
  onSelectVenue = null,
  apiError = "",
  apiSuccess = "",
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState("");
  const [price, setPrice] = useState("");
  const [maxGuests, setMaxGuests] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const [continent, setContinent] = useState("");
  const [wifi, setWifi] = useState(false);
  const [parking, setParking] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
      const firstMedia =
        initialData.media && initialData.media.length > 0
          ? initialData.media[0].url
          : "";
      setMedia(firstMedia || "");
      setPrice(initialData.price != null ? initialData.price : "");
      setMaxGuests(initialData.maxGuests != null ? initialData.maxGuests : "");
      setAddress(initialData.location?.address || "");
      setCity(initialData.location?.city || "");
      setZip(initialData.location?.zip || "");
      setCountry(initialData.location?.country || "");
      setContinent(initialData.location?.continent || "");
      setWifi(initialData.meta?.wifi || false);
      setParking(initialData.meta?.parking || false);
      setBreakfast(initialData.meta?.breakfast || false);
      setPets(initialData.meta?.pets || false);
      setFieldErrors({});
      setErrorMessages([]);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = [];
    let fieldErrs = {};

    if (!name.trim()) {
      errors.push("Please enter a venue name");
      fieldErrs.name = true;
    }
    if (!description.trim()) {
      errors.push("Please enter a description");
      fieldErrs.description = true;
    }
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      errors.push("Please enter a valid price");
      fieldErrs.price = true;
    }
    if (!maxGuests || isNaN(Number(maxGuests)) || Number(maxGuests) <= 0) {
      errors.push("Please enter a valid number of guests");
      fieldErrs.maxGuests = true;
    }
    if (!address.trim()) {
      errors.push("Please enter an address");
      fieldErrs.address = true;
    }
    if (!city.trim()) {
      errors.push("Please enter a city");
      fieldErrs.city = true;
    }
    if (!zip.trim()) {
      errors.push("Please enter a zip code");
      fieldErrs.zip = true;
    }
    if (!country.trim()) {
      errors.push("Please enter a country");
      fieldErrs.country = true;
    }
    if (!continent.trim()) {
      errors.push("Please enter a continent");
      fieldErrs.continent = true;
    }
    if (media.trim()) {
      try {
        new URL(media);
      } catch {
        errors.push("Image must be a valid URL");
        fieldErrs.media = true;
      }
    }

    setFieldErrors(fieldErrs);
    setErrorMessages(errors);

    if (errors.length > 0) return;

    const formData = {
      name: name.trim(),
      description: description.trim(),
      media: media.trim()
        ? [{ url: media.trim(), alt: `${name.trim()} image` }]
        : [],
      price: Number(price),
      maxGuests: Number(maxGuests),
      location: {
        address: address.trim(),
        city: city.trim(),
        zip: zip.trim(),
        country: country.trim(),
        continent: continent.trim(),
      },
      meta: {
        wifi,
        parking,
        breakfast,
        pets,
      },
    };

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md bg-white p-6 rounded-md shadow-md"
    >
      {venuesList && onSelectVenue && (
        <div className="mb-6">
          <label
            htmlFor="venueSelect"
            className="block text-sm font-medium text-gray-900 mb-1"
          >
            Select a venue to edit:
          </label>
          <select
            id="venueSelect"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900"
            defaultValue=""
            onChange={(e) => onSelectVenue(e.target.value)}
          >
            <option value="" disabled>
              Select venue...
            </option>
            {venuesList.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {(!venuesList || initialData) && (
        <>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Venue Details
          </h2>
          <div className="space-y-4 mb-8">
            <div>
              <label
                htmlFor="venueName"
                className={`block text-xs font-medium mb-1 ${
                  fieldErrors.name ? "text-red-600" : "text-gray-900"
                }`}
              >
                Venue Name <span className="text-red-500">*</span>
              </label>
              <input
                id="venueName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${
                  fieldErrors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="venueDescription"
                className={`block text-xs font-medium mb-1 ${
                  fieldErrors.description ? "text-red-600" : "text-gray-900"
                }`}
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="venueDescription"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${
                  fieldErrors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="venueMedia"
                className={`block text-xs font-medium mb-1 ${
                  fieldErrors.media ? "text-red-600" : "text-gray-900"
                }`}
              >
                Media Image URL
              </label>
              <input
                id="venueMedia"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={media}
                onChange={(e) => setMedia(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${
                  fieldErrors.media ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="venuePrice"
                className={`block text-xs font-medium mb-1 ${
                  fieldErrors.price ? "text-red-600" : "text-gray-900"
                }`}
              >
                Price per night (NOK) <span className="text-red-500">*</span>
              </label>
              <input
                id="venuePrice"
                type="number"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${
                  fieldErrors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="venueGuests"
                className={`block text-xs font-medium mb-1 ${
                  fieldErrors.maxGuests ? "text-red-600" : "text-gray-900"
                }`}
              >
                Max Guests <span className="text-red-500">*</span>
              </label>
              <input
                id="venueGuests"
                type="number"
                min="1"
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${
                  fieldErrors.maxGuests ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
          <div className="space-y-4 mb-8">
            <div>
              <label
                htmlFor="venueAddress"
                className={`block text-xs font-medium mb-1 ${
                  fieldErrors.address ? "text-red-600" : "text-gray-900"
                }`}
              >
                Address <span className="text-red-500">*</span>
              </label>
              <input
                id="venueAddress"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${
                  fieldErrors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="venueCity"
                className={`block text-xs font-medium mb-1 ${
                  fieldErrors.city ? "text-red-600" : "text-gray-900"
                }`}
              >
                City <span className="text-red-500">*</span>
              </label>
              <input
                id="venueCity"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${
                  fieldErrors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="venueZip"
                className={`block text-xs font-medium mb-1 ${
                  fieldErrors.zip ? "text-red-600" : "text-gray-900"
                }`}
              >
                Zip Code <span className="text-red-500">*</span>
              </label>
              <input
                id="venueZip"
                type="text"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${
                  fieldErrors.zip ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="venueCountry"
                className={`block text-xs font-medium mb-1 ${
                  fieldErrors.country ? "text-red-600" : "text-gray-900"
                }`}
              >
                Country <span className="text-red-500">*</span>
              </label>
              <input
                id="venueCountry"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${
                  fieldErrors.country ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="venueContinent"
                className={`block text-xs font-medium mb-1 ${
                  fieldErrors.continent ? "text-red-600" : "text-gray-900"
                }`}
              >
                Continent <span className="text-red-500">*</span>
              </label>
              <input
                id="venueContinent"
                type="text"
                value={continent}
                onChange={(e) => setContinent(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 ${
                  fieldErrors.continent ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Amenities
          </h2>
          <div className="space-y-2 mb-8">
            {[
              {
                label: "Wi-Fi",
                checked: wifi,
                setter: setWifi,
                id: "amenityWifi",
              },
              {
                label: "Parking",
                checked: parking,
                setter: setParking,
                id: "amenityParking",
              },
              {
                label: "Breakfast",
                checked: breakfast,
                setter: setBreakfast,
                id: "amenityBreakfast",
              },
              {
                label: "Pets Allowed",
                checked: pets,
                setter: setPets,
                id: "amenityPets",
              },
            ].map(({ label, checked, setter, id }) => (
              <div key={id} className="flex items-center">
                <input
                  id={id}
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setter(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor={id} className="ml-2 text-sm text-gray-900">
                  {label}
                </label>
              </div>
            ))}
          </div>

          <div
            className={`flex ${onDelete ? "justify-between" : ""} items-center`}
          >
            <Button type="submit">{submitLabel}</Button>
            {onDelete && (
              <Button type="button" onClick={onDelete} variant="error">
                Delete Venue
              </Button>
            )}
          </div>

          <div className="mt-4">
            {(errorMessages.length > 0 || apiError) && (
              <ul className="text-sm text-red-500 space-y-1 mb-2">
                {errorMessages.map((msg, idx) => (
                  <li key={idx}>✕ {msg}</li>
                ))}
                {apiError && <li>✕ {apiError}</li>}
              </ul>
            )}
            {apiSuccess && (
              <p className="text-sm text-green-600">✓ {apiSuccess}</p>
            )}
          </div>
        </>
      )}
    </form>
  );
}

export default VenueForm;
