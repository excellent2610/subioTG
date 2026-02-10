import { createElement, qs } from "../utils/dom.js";
import { ROUTES } from "../utils/constants.js";

export const renderNavbar = (state) => {
  const navbar = qs("#navbar");
  if (!navbar) return;

  navbar.innerHTML = "";

  const navLinks = ROUTES.map((route) => `
    <a class="topbar-link ${window.location.hash === route.path ? "active" : ""}" href="${route.path}">
      ${route.label}
    </a>
  `).join("");

  const wrapper = createElement(`
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-brand">
          <span class="brand-dot"></span>
          <span>SUBIO</span>
        </div>
        <nav class="topbar-nav">
          ${navLinks}
        </nav>
      </div>
      <div class="topbar-actions">
        <button id="theme-toggle" class="button ghost">${state.theme === "theme-dark" ? "Light" : "Dark"}</button>
        <button class="button pill">Profile</button>
        <button id="open-modal" class="button primary pill">Add</button>
      </div>
    </div>
  `);

  navbar.appendChild(wrapper);
};
