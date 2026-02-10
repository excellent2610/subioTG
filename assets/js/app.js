import { renderDashboardPage } from "./pages/dashboardPage.js";
import { renderSettingsPage } from "./pages/settingsPage.js";
import { renderAboutPage } from "./pages/aboutPage.js";
import { renderLoginPage } from "./pages/loginPage.js";
import { renderRegisterPage } from "./pages/registerPage.js";
import { renderProfilePage } from "./pages/profilePage.js";
import { renderSubscriptionsPage } from "./pages/subscriptionsPage.js";
import { renderSupportPage } from "./pages/supportPage.js";
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
    render: renderDashboardPage,
    auth: true
  },
  "#settings": {
    title: "Workspace settings",
    subtitle: "Control how data, policies, and notifications behave.",
    render: renderSettingsPage,
    auth: true
  },
  "#about": {
    title: "About the platform",
    subtitle: "Why the SubioTG console is built for speed and safety.",
    render: renderAboutPage,
    auth: false
  },
  "#login": {
    title: "Sign in",
    subtitle: "Access your subscription console.",
    render: renderLoginPage,
    auth: false
  },
  "#register": {
    title: "Create account",
    subtitle: "Start managing premium bot features.",
    render: renderRegisterPage,
    auth: false
  },
  "#profile": {
    title: "Your profile",
    subtitle: "Manage identity and security.",
    render: renderProfilePage,
    auth: true
  },
  "#subscriptions": {
    title: "Subscriptions",
    subtitle: "Upgrade, manage renewals, and view invoices.",
    render: renderSubscriptionsPage,
    auth: true
  },
  "#support": {
    title: "Support center",
    subtitle: "Open a ticket and track status updates.",
    render: renderSupportPage,
    auth: true
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

const ensureAuthData = async () => {
  const state = getState();
  if (!state.session?.authenticated) return;

  if (!state.subscriptions.length) {
    const subs = await mockApiService.listSubscriptions();
    setState({ subscriptions: subs });
  }
  if (!state.payments.length) {
    const payments = await mockApiService.listPayments();
    setState({ payments });
  }
};

const guardRoute = (hash) => {
  const route = routeConfig[hash];
  if (!route) return "#dashboard";
  if (route.auth && !getState().session?.authenticated) {
    return "#login";
  }
  return hash;
};

const renderRoute = async () => {
  const initialHash = resolveRoute(window.location.hash);
  const guardedHash = guardRoute(initialHash);
  if (guardedHash !== window.location.hash) {
    router.navigate(guardedHash);
    return;
  }

  const route = routeConfig[guardedHash];
  const state = getState();

  renderSidebar(guardedHash);
  renderNavbar(state);

  const container = outlet();
  if (!container) return;
  container.innerHTML = "";
  container.appendChild(route.render(state));

  setState({ lastRoute: guardedHash });
};

const bootstrapDashboard = async () => {
  try {
    const data = await mockApiService.fetchDashboardData();
    setState({ data });
  } catch (error) {
    showToast("Failed to load analytics. Using cached state.", "warn");
  }
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

const bindUI = () => {
  document.body.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.id === "theme-toggle") {
      const state = getState();
      const nextTheme = state.theme === THEMES.dark ? THEMES.light : THEMES.dark;
      applyTheme(nextTheme);
      setState({ theme: nextTheme });
      await renderRoute();
      setupChart();
    }

    if (target.id === "logout") {
      setState({ session: { authenticated: false }, user: null });
      showToast("You have been logged out.", "info");
      router.navigate("#login");
      return;
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

    if (target.id === "forgot-password") {
      showModal(`
        <h2 style="margin-top:0;">Reset password</h2>
        <p>Enter your email to receive a reset link.</p>
        <div class="form-stack" style="margin-top:1rem;">
          <input id="reset-email" type="email" placeholder="you@subio.io" style="padding:0.6rem 0.75rem; border-radius:12px; border:1px solid rgba(255,255,255,0.08); background:rgba(15,23,42,0.6); color:#f8fafc;" />
        </div>
        <div style="display:flex; gap:0.75rem; margin-top:1.5rem;">
          <button id="confirm-reset" class="button primary">Send link</button>
          <button id="cancel-reset" class="button">Cancel</button>
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

    if (target.id === "confirm-reset") {
      const input = document.getElementById("reset-email");
      const email = input ? input.value : "";
      try {
        await mockApiService.requestPasswordReset(email);
        showToast("Reset link sent", "success");
      } catch (error) {
        showToast(error.message || "Unable to send reset link", "warn");
      }
      hideModal();
    }

    if (target.id === "cancel-reset") {
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

    if (target.matches("[data-plan]")) {
      const plan = target.getAttribute("data-plan");
      const subscription = await mockApiService.createSubscription(plan);
      setState({ subscriptions: [...getState().subscriptions, subscription] });
      showToast(`${plan} plan activated`, "success");
      renderRoute();
    }

    if (target.matches("[data-cancel]")) {
      const id = target.getAttribute("data-cancel");
      const result = await mockApiService.cancelSubscription(id);
      const nextSubs = getState().subscriptions.map((sub) => (sub.id === id ? { ...sub, status: result.status } : sub));
      setState({ subscriptions: nextSubs });
      showToast("Subscription canceled", "info");
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

  document.body.addEventListener("submit", async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;

    if (form.id === "login-form") {
      event.preventDefault();
      const formData = new FormData(form);
      try {
        const user = await mockApiService.login({
          email: formData.get("email"),
          password: formData.get("password")
        });
        setState({ session: { authenticated: true }, user });
        await ensureAuthData();
        showToast("Welcome back!", "success");
        router.navigate("#dashboard");
      } catch (error) {
        showToast(error.message || "Login failed", "warn");
      }
    }

    if (form.id === "register-form") {
      event.preventDefault();
      const formData = new FormData(form);
      const password = formData.get("password");
      const confirm = formData.get("passwordConfirm");
      if (password !== confirm) {
        showToast("Passwords do not match", "warn");
        return;
      }
      const user = await mockApiService.register({
        name: formData.get("name"),
        email: formData.get("email")
      });
      setState({ session: { authenticated: true }, user });
      await ensureAuthData();
      showToast("Account created", "success");
      router.navigate("#dashboard");
    }

    if (form.id === "profile-form") {
      event.preventDefault();
      const formData = new FormData(form);
      const user = await mockApiService.updateProfile({
        name: formData.get("name"),
        email: formData.get("email")
      });
      setState({ user });
      showToast("Profile updated", "success");
      renderRoute();
    }

    if (form.id === "password-form") {
      event.preventDefault();
      const formData = new FormData(form);
      const password = formData.get("password");
      const confirm = formData.get("passwordConfirm");
      if (password !== confirm) {
        showToast("Passwords do not match", "warn");
        return;
      }
      await mockApiService.updatePassword();
      showToast("Password updated", "success");
      form.reset();
    }

    if (form.id === "support-form") {
      event.preventDefault();
      const formData = new FormData(form);
      const ticket = await mockApiService.createSupportTicket({
        subject: formData.get("subject"),
        priority: formData.get("priority"),
        message: formData.get("message")
      });
      setState({ supportTickets: [ticket, ...getState().supportTickets] });
      showToast("Ticket submitted", "success");
      renderRoute();
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
  await ensureAuthData();
  await renderRoute();
  setupChart();

  window.addEventListener("hashchange", async () => {
    await renderRoute();
    setupChart();
  });
};

init();
