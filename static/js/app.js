const root = document.documentElement;
const storedTheme = localStorage.getItem("subio-theme");
if (storedTheme) {
  root.classList.toggle("light", storedTheme === "light");
}

const toggle = document.getElementById("theme-toggle");
if (toggle) {
  toggle.addEventListener("click", async () => {
    root.classList.toggle("light");
    const mode = root.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("subio-theme", mode);
    const csrfInput = document.querySelector("input[name='csrf_token']");
    if (csrfInput) {
      const form = new FormData();
      form.append("csrf_token", csrfInput.value);
      form.append("theme", mode);
      try {
        await fetch("/theme", { method: "POST", body: form });
      } catch (error) {
        // no-op
      }
    }
  });
}
