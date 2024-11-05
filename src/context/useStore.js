import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      username: "",
      setUsername: (username) => set({ username }),
      isUserLoggedIn: () => !!get().username,
      logout: () => set({ username: "" }),
    }),
    {
      name: "user-storage", // Name of the storage item (key) in localStorage
      getStorage: () => localStorage, // Specify the storage to use (default is localStorage)
    }
  )
);

export default useStore;
