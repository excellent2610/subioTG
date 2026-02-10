import { ROUTES } from "../utils/constants.js";
import { createElement, qs } from "../utils/dom.js";

export const renderSidebar = (activeRoute) => {
  const sidebar = qs("#sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = "";

  const header = createElement(`
    <div class="sidebar-brand">
      <img src="assets/img/logo.svg" alt="SubioTG logo" width="36" height="36" />
      <div>
        <div>SubioTG Ops</div>
        <div class="mono" style="font-size: 0.7rem; color: var(--text-3);">Enterprise Console</div>
      </div>
    </div>
  `);

  const nav = document.createElement("nav");
  nav.className = "sidebar-nav";

  const primaryLabel = createElement(`<div class="nav-section">Primary</div>`);
  nav.appendChild(primaryLabel);

  ROUTES.forEach((route) => {
    const link = createElement(`
      <a class="nav-link ${activeRoute === route.path ? "active" : ""}" href="${route.path}">
        <span>${route.icon}</span>
        <span>${route.label}</span>
      </a>
    `);
    nav.appendChild(link);
  });

  const secondaryLabel = createElement(`<div class="nav-section">Tools</div>`);
  nav.appendChild(secondaryLabel);

  [
    { label: "Workflows", icon: "WF" },
    { label: "Agents", icon: "AG" },
    { label: "Audit Logs", icon: "AL" }
  ].forEach((item) => {
    const entry = createElement(`
      <div class="nav-link" role="button" tabindex="0">
        <span>${item.icon}</span>
        <span>${item.label}</span>
      </div>
    `);
    nav.appendChild(entry);
  });

  const footer = createElement(`
    <div class="nav-footer">
      <div style="font-size:0.85rem; font-weight:600;">Cluster Health</div>
      <div style="font-size:0.75rem; color:var(--text-3);">All regions within SLA</div>
      <div class="badge" style="margin-top:0.75rem;">99.97% uptime</div>
    </div>
  `);

  sidebar.appendChild(header);
  sidebar.appendChild(nav);
  sidebar.appendChild(footer);
};
