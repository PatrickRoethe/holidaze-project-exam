import useAuthStore from "../store/authStore";

export default function useAuth() {
  const { user, accessToken, isVenueManager } = useAuthStore();
  return { user, accessToken, isVenueManager };
}
