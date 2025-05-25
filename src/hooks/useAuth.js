import useAuthStore from "../store/authStore";

export default function useAuth() {
  const { user, accessToken, apiKey, isVenueManager } = useAuthStore();

  return {
    user,
    accessToken,
    apiKey,
    isVenueManager,
  };
}
