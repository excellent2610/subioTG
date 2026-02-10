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
  data: null,
  session: { authenticated: false },
  user: null,
  subscriptions: [],
  payments: [],
  supportTickets: []
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
  const storedSession = storageService.get(STORAGE_KEYS.session, null);
  const storedUser = storageService.get(STORAGE_KEYS.user, null);
  const storedSubscriptions = storageService.get(STORAGE_KEYS.subscriptions, null);
  const storedPayments = storageService.get(STORAGE_KEYS.payments, null);
  const storedSupport = storageService.get(STORAGE_KEYS.support, null);

  state = {
    ...state,
    theme: storedTheme || state.theme,
    lastRoute: storedRoute || state.lastRoute,
    preferences: storedPrefs || state.preferences,
    session: storedSession || state.session,
    user: storedUser || state.user,
    subscriptions: storedSubscriptions || state.subscriptions,
    payments: storedPayments || state.payments,
    supportTickets: storedSupport || state.supportTickets
  };
};
