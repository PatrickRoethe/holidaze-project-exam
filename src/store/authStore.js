import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isVenueManager: false,

  login: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
      isVenueManager: user.venueManager === true,
    }),

  logout: () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("user");
    set({
      user: null,
      accessToken: null,
      isVenueManager: false,
    });
  },

  initAuth: () => {
    try {
      const storedUser = JSON.parse(sessionStorage.getItem("user"));
      const storedToken = sessionStorage.getItem("accessToken");

      set({
        user: storedUser || null,
        accessToken: storedToken || null,
        isVenueManager: storedUser?.venueManager === true,
      });
    } catch (e) {
      console.error("[initAuth] Failed to parse sessionStorage user:", e);
      set({
        user: null,
        accessToken: null,
        isVenueManager: false,
      });
    }
  },
}));

export default useAuthStore;

// 👇 Gjør tilgjengelig i devtools
if (import.meta.env.MODE === "development") {
  window.authStore = useAuthStore;
}
