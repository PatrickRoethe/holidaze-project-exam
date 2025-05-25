import axios from "axios";
import { create } from "zustand";

const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  /**
   * Henter brukerprofil med venues og bookings
   */
  fetchProfile: async ({ name, accessToken, apiKey }) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.get(
        `https://v2.api.noroff.dev/holidaze/profiles/${name}?_venues=true&_bookings=true`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
          },
        }
      );

      set({ profile: response.data.data });
    } catch (error) {
      console.error("[profileStore] Failed to fetch profile:", error);
      set({ error: "Failed to load profile data" });
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Oppdaterer avatar med ny URL
   */
  updateAvatar: async ({ name, avatarUrl, accessToken, apiKey }) => {
    set({ loading: true, error: null });

    try {
      const response = await axios.put(
        `https://v2.api.noroff.dev/holidaze/profiles/${name}`,
        {
          avatar: {
            url: avatarUrl,
            alt: `${name}'s avatar`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      set({ profile: response.data.data });
      return { success: true };
    } catch (error) {
      console.error("[profileStore] Failed to update avatar:", error);
      const message =
        error?.response?.data?.errors?.[0]?.message ||
        "Could not update avatar";
      return { success: false, error: message };
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProfileStore;
