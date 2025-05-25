import { useEffect, useState } from "react";
import Avatar from "../components/base/Avatar";
import Button from "../components/base/Button";
import ErrorMessage from "../components/base/ErrorMessage";
import Input from "../components/base/Input";
import Loader from "../components/base/Loader";
import useAuth from "../hooks/useAuth";
import useProfileStore from "../store/profileStore";

export default function Profile() {
  const { user, accessToken, apiKey } = useAuth();
  const { profile, fetchProfile, updateAvatar, loading, error } =
    useProfileStore();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [feedback, setFeedback] = useState({ success: "", error: "" });

  useEffect(() => {
    if (user?.name && accessToken && apiKey) {
      fetchProfile({ name: user.name, accessToken, apiKey });
    }
  }, [user?.name, accessToken, apiKey, fetchProfile]);

  async function handleAvatarUpdate(e) {
    e.preventDefault();
    if (!avatarUrl) return;

    setFeedback({ success: "", error: "" });

    const result = await updateAvatar({
      name: user.name,
      avatarUrl,
      accessToken,
      apiKey,
    });

    if (result.success) {
      setFeedback({ success: "Avatar updated!", error: "" });
    } else {
      setFeedback({ error: result.error || "Update failed", success: "" });
    }
  }

  if (loading || !profile) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 bg-white rounded shadow space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="flex gap-6 items-center">
        <Avatar src={profile.avatar?.url} alt={profile.avatar?.alt} />
        <div>
          <p className="text-lg font-semibold">{profile.name}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
        </div>
      </div>

      <form onSubmit={handleAvatarUpdate} className="space-y-4">
        <Input
          label="New avatar image URL"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          placeholder="https://..."
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update avatar"}
        </Button>

        {feedback.error && (
          <p className="text-sm text-red-500">{feedback.error}</p>
        )}
        {feedback.success && (
          <p className="text-sm text-green-600">{feedback.success}</p>
        )}
      </form>
    </div>
  );
}
