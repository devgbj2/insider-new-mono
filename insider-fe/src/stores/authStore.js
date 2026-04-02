import { create } from "zustand";

const getStorage = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const user =
    localStorage.getItem("user") || sessionStorage.getItem("user");

  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
};

const removeStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,

  initAuth: () => {
    const data = getStorage();

    if (data?.token) {
      try {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        const now = Date.now() / 1000;

        if (payload.exp < now) {
          throw new Error("expired");
        }

        // auto logout timer
        const timeout = payload.exp * 1000 - Date.now();

        setTimeout(() => {
          removeStorage();
          set({ token: null, user: null });
        }, timeout);

        set({ ...data, isLoading: false });
      } catch {
        removeStorage();
        set({ token: null, user: null, isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },

  login: (token, user, remember) => {
    const storage = remember ? localStorage : sessionStorage;

    storage.setItem("token", token);
    storage.setItem("user", JSON.stringify(user));

    // decode untuk set auto logout
    const payload = JSON.parse(atob(token.split(".")[1]));
    const timeout = payload.exp * 1000 - Date.now();

    setTimeout(() => {
      removeStorage();
      set({ token: null, user: null });
    }, timeout);

    set({ token, user });
  },

  logout: () => {
    removeStorage();
    set({ token: null, user: null });
  },
}));