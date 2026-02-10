export const router = {
  navigate(route) {
    window.location.hash = route;
  },
  getCurrent() {
    return window.location.hash || "#dashboard";
  }
};
