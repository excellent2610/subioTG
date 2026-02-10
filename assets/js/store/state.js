import { storageService } from "../services/storageService.js";
import { STORAGE_KEYS } from "../utils/constants.js";

const listeners = new Set();

const defaultState = {
  theme: "theme-dark",
  lastRoute: "#dashboard",
  preferences: {
    notifications: true,
    autoSync: true,
    dataRegion: "us-east-1"
  },
  data: null
};

let state = { ...defaultState };

export const getState = () => ({ ...state });

export const setState = (partial) => {
  state = { ...state, ...partial };
  listeners.forEach((listener) => listener(getState()));
};

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const hydrate = () => {
  const storedTheme = storageService.get(STORAGE_KEYS.theme, null);
  const storedRoute = storageService.get(STORAGE_KEYS.lastRoute, null);
  const storedPrefs = storageService.get(STORAGE_KEYS.preferences, null);

  state = {
    ...state,
    theme: storedTheme || state.theme,
    lastRoute: storedRoute || state.lastRoute,
    preferences: storedPrefs || state.preferences
  };
};
