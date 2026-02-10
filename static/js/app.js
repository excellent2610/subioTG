const root = document.documentElement;
const storedTheme = localStorage.getItem("subio-theme");
if (storedTheme) {
  root.classList.toggle("light", storedTheme === "light");
}

const toggle = document.getElementById("theme-toggle");
if (toggle) {
  toggle.addEventListener("click", () => {
    root.classList.toggle("light");
    localStorage.setItem("subio-theme", root.classList.contains("light") ? "light" : "dark");
  });
}
