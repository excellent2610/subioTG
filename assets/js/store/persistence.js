import { storageService } from "../services/storageService.js";
import { STORAGE_KEYS } from "../utils/constants.js";

export const persistState = (state) => {
  storageService.set(STORAGE_KEYS.theme, state.theme);
  storageService.set(STORAGE_KEYS.lastRoute, state.lastRoute);
  storageService.set(STORAGE_KEYS.preferences, state.preferences);
};
