export const ROUTES = [
  { path: "#dashboard", label: "Dashboard", icon: "D", auth: true },
  { path: "#subscriptions", label: "Subscriptions", icon: "S", auth: true },
  { path: "#support", label: "Support", icon: "H", auth: true },
  { path: "#profile", label: "Profile", icon: "P", auth: true },
  { path: "#about", label: "About", icon: "A", auth: false }
];

export const STORAGE_KEYS = {
  theme: "subio.theme",
  lastRoute: "subio.lastRoute",
  preferences: "subio.preferences",
  session: "subio.session",
  user: "subio.user",
  subscriptions: "subio.subscriptions",
  payments: "subio.payments",
  support: "subio.support"
};

export const THEMES = {
  light: "theme-light",
  dark: "theme-dark"
};
