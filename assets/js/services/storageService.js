import { STORAGE_KEYS } from "../utils/constants.js";

export const storageService = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove(key) {
    localStorage.removeItem(key);
  },
  getTheme() {
    return storageService.get(STORAGE_KEYS.theme, null);
  }
};
