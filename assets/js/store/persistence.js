import { storageService } from "../services/storageService.js";
import { STORAGE_KEYS } from "../utils/constants.js";

export const persistState = (state) => {
  storageService.set(STORAGE_KEYS.theme, state.theme);
  storageService.set(STORAGE_KEYS.lastRoute, state.lastRoute);
  storageService.set(STORAGE_KEYS.preferences, state.preferences);
  storageService.set(STORAGE_KEYS.session, state.session);
  storageService.set(STORAGE_KEYS.user, state.user);
  storageService.set(STORAGE_KEYS.subscriptions, state.subscriptions);
  storageService.set(STORAGE_KEYS.payments, state.payments);
  storageService.set(STORAGE_KEYS.support, state.supportTickets);
};
