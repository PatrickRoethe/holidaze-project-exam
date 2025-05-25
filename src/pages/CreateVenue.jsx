import { useState } from "react";
import VenueForm from "../components/Venue/VenueForm";

function CreateVenue() {
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  const token = sessionStorage.getItem("accessToken");
  const apiKey = sessionStorage.getItem("apiKey"); // ← viktig!

  const handleCreateVenue = async (formData) => {
    setApiError("");
    setApiSuccess("");

    try {
      const response = await fetch(
        "https://v2.api.noroff.dev/holidaze/venues",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        let message = "Failed to create venue";
        if (errorData.errors) {
          message = errorData.errors.join(". ");
        } else if (errorData.message) {
          message = errorData.message;
        }
        setApiError(message);
      } else {
        setApiSuccess("Venue successfully created");
      }
    } catch (err) {
      setApiError("Network error: " + err.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Create Venue</h1>
      <VenueForm
        submitLabel="Create Venue"
        onSubmit={handleCreateVenue}
        apiError={apiError}
        apiSuccess={apiSuccess}
      />
    </div>
  );
}

export default CreateVenue;
