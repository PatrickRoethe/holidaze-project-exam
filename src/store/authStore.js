import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  apiKey: null,
  isVenueManager: false,

  login: ({ user, accessToken, apiKey }) =>
    set({
      user,
      accessToken,
      apiKey,
      isVenueManager:
        user.venueManager === true ||
        user.venueManager === "true" ||
        user.venueManager === 1,
    }),

  logout: () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("apiKey");
    set({
      user: null,
      accessToken: null,
      apiKey: null,
      isVenueManager: false,
    });
  },

  initAuth: () => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const storedToken = sessionStorage.getItem("accessToken");
      const storedApiKey = sessionStorage.getItem("apiKey");

      set({
        user: storedUser || null,
        accessToken: storedToken || null,
        apiKey: storedApiKey || null,
        isVenueManager:
          storedUser?.venueManager === true ||
          storedUser?.venueManager === "true" ||
          storedUser?.venueManager === 1,
      });
    } catch (e) {
      console.error("[initAuth] Failed to parse sessionStorage:", e);
      set({
        user: null,
        accessToken: null,
        apiKey: null,
        isVenueManager: false,
      });
    }
  },

  setApiKey: (apiKey) => {
    sessionStorage.setItem("apiKey", apiKey);
    set({ apiKey });
  },
}));

export default useAuthStore;

if (import.meta.env.MODE === "development") {
  window.authStore = useAuthStore;
}
