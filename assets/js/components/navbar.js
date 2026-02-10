import { createElement, qs } from "../utils/dom.js";

export const renderNavbar = (state) => {
  const navbar = qs("#navbar");
  if (!navbar) return;

  navbar.innerHTML = "";

  const wrapper = createElement(`
    <div class="navbar-row">
      <div>
        <div style="font-size: 1.2rem; font-weight: 600;">${state.pageTitle}</div>
        <div style="color: var(--text-3); font-size: 0.85rem;">${state.pageSubtitle}</div>
      </div>
      <div class="navbar-actions">
        <label class="search-input">
          <span>🔎</span>
          <input type="search" placeholder="Search workflows, agents..." />
        </label>
        <button id="theme-toggle" class="button">${state.theme === "theme-dark" ? "Light" : "Dark"} mode</button>
        <button id="open-modal" class="button primary">New incident</button>
      </div>
    </div>
  `);

  navbar.appendChild(wrapper);
};
