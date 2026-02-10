import { renderDashboardPage } from "./pages/dashboardPage.js";
import { renderSettingsPage } from "./pages/settingsPage.js";
import { renderAboutPage } from "./pages/aboutPage.js";
import { renderNavbar } from "./components/navbar.js";
import { renderSidebar } from "./components/sidebar.js";
import { showToast } from "./components/toast.js";
import { showModal, hideModal } from "./components/modal.js";
import { mockApiService } from "./services/mockApiService.js";
import { hydrate, getState, setState, subscribe } from "./store/state.js";
import { persistState } from "./store/persistence.js";
import { THEMES } from "./utils/constants.js";
import { qs } from "./utils/dom.js";
import { router } from "./router.js";

const outlet = () => qs("#route-outlet");

const routeConfig = {
  "#dashboard": {
    title: "Operations overview",
    subtitle: "Live insights across agents, workflows, and risk budgets.",
    render: renderDashboardPage
  },
  "#settings": {
    title: "Workspace settings",
    subtitle: "Control how data, policies, and notifications behave.",
    render: renderSettingsPage
  },
  "#about": {
    title: "About the platform",
    subtitle: "Why the SubioTG console is built for speed and safety.",
    render: renderAboutPage
  }
};

const resolveRoute = (hash) => {
  const normalized = hash || router.getCurrent() || getState().lastRoute || "#dashboard";
  return routeConfig[normalized] ? normalized : "#dashboard";
};

const applyTheme = (theme) => {
  const body = document.body;
  body.classList.remove(...Object.values(THEMES));
  body.classList.add(theme);
};

const renderRoute = () => {
  const hash = resolveRoute(window.location.hash);
  const route = routeConfig[hash];
  const state = getState();

  renderSidebar(hash);
  renderNavbar({ theme: state.theme, pageTitle: route.title, pageSubtitle: route.subtitle });

  const container = outlet();
  if (!container) return;
  container.innerHTML = "";
  container.appendChild(route.render(state));

  setState({ lastRoute: hash });
};

const bootstrapDashboard = async () => {
  try {
    const data = await mockApiService.fetchDashboardData();
    setState({ data });
  } catch (error) {
    showToast("Failed to load analytics. Using cached state.", "warn");
  }
};

const bindUI = () => {
  document.body.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === "theme-toggle") {
      const state = getState();
      const nextTheme = state.theme === THEMES.dark ? THEMES.light : THEMES.dark;
      applyTheme(nextTheme);
      setState({ theme: nextTheme });
      renderRoute();
      setupChart();
    }

    if (target.id === "open-modal") {
      showModal(`
        <h2 style="margin-top:0;">New incident</h2>
        <p>Create a rapid response workflow for an active incident.</p>
        <div style="display:flex; gap:0.75rem; margin-top:1.5rem;">
          <button id="confirm-incident" class="button primary">Create workflow</button>
          <button id="cancel-incident" class="button">Cancel</button>
        </div>
      `);
    }

    if (target.id === "confirm-incident") {
      hideModal();
      showToast("Incident workflow created", "success");
    }

    if (target.id === "cancel-incident") {
      hideModal();
    }

    if (target.id === "save-preferences") {
      showToast("Preferences saved", "success");
    }

    if (target.id === "reset-preferences") {
      setState({
        preferences: {
          notifications: true,
          autoSync: true,
          dataRegion: "us-east-1"
        }
      });
      showToast("Preferences reset", "info");
      renderRoute();
    }

    if (target.matches(".toggle")) {
      const pref = target.getAttribute("data-pref");
      const state = getState();
      const preferences = { ...state.preferences };
      preferences[pref] = !preferences[pref];
      setState({ preferences });
      renderRoute();
    }
  });

  document.body.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches("select[data-pref='dataRegion']")) {
      const state = getState();
      setState({ preferences: { ...state.preferences, dataRegion: target.value } });
    }
  });
};

const setupChart = () => {
  const canvas = document.getElementById("fleet-chart");
  if (!canvas || !window.Chart) return;

  const data = getState().data;
  if (!data) return;

  new window.Chart(canvas, {
    type: "line",
    data: {
      labels: data.chart.labels,
      datasets: data.chart.series.map((series) => ({
        label: series.label,
        data: series.data,
        borderColor: series.color,
        backgroundColor: series.fill,
        tension: 0.3,
        fill: true
      }))
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body).getPropertyValue("--text-2")
          }
        }
      },
      scales: {
        x: {
          ticks: { color: getComputedStyle(document.body).getPropertyValue("--text-3") },
          grid: { color: "rgba(255,255,255,0.04)" }
        },
        y: {
          ticks: { color: getComputedStyle(document.body).getPropertyValue("--text-3") },
          grid: { color: "rgba(255,255,255,0.04)" }
        }
      }
    }
  });
};

const init = async () => {
  hydrate();
  applyTheme(getState().theme);
  bindUI();

  subscribe((nextState) => {
    persistState(nextState);
  });

  await bootstrapDashboard();
  renderRoute();
  setupChart();

  window.addEventListener("hashchange", () => {
    renderRoute();
    setupChart();
  });
};

init();
