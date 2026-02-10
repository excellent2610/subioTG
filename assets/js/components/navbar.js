import { createElement, qs } from "../utils/dom.js";
import { ROUTES } from "../utils/constants.js";

export const renderNavbar = (state) => {
  const navbar = qs("#navbar");
  if (!navbar) return;

  navbar.innerHTML = "";
  const isAuthed = state.session?.authenticated;
  const user = state.user;

  const navLinks = ROUTES.filter((route) => !route.auth || isAuthed)
    .map((route) => `
      <a class="topbar-link ${window.location.hash === route.path ? "active" : ""}" href="${route.path}">
        ${route.label}
      </a>
    `)
    .join("");

  const authButtons = isAuthed
    ? `
      <button id="theme-toggle" class="button ghost">${state.theme === "theme-dark" ? "Light" : "Dark"}</button>
      <a class="button pill" href="#profile">${user?.name || "Profile"}</a>
      <button id="logout" class="button primary pill">Logout</button>
    `
    : `
      <button id="theme-toggle" class="button ghost">${state.theme === "theme-dark" ? "Light" : "Dark"}</button>
      <a class="button pill" href="#login">Login</a>
      <a class="button primary pill" href="#register">Create account</a>
    `;

  const wrapper = createElement(`
    <div class="topbar">
      <div class="topbar-left">
        <a class="topbar-brand" href="#dashboard">
          <span class="brand-dot"></span>
          <span>SUBIO</span>
        </a>
        <nav class="topbar-nav">
          ${navLinks}
        </nav>
      </div>
      <div class="topbar-actions">
        ${authButtons}
      </div>
    </div>
  `);

  navbar.appendChild(wrapper);
};
