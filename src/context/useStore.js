import { create } from "zustand";

const useStore = create((set) => ({
  username: "",
  setUsername: (username) => set({ username }),
  isUserLoggedIn: () => !!useStore.getState().username,
  logout: () => set({ username: "" }),
}));

export default useStore;
