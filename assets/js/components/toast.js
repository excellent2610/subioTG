import { createElement, qs } from "../utils/dom.js";

export const showToast = (message, tone = "info") => {
  const root = qs("#toast-root");
  if (!root) return;

  const toast = createElement(`
    <div class="toast" data-tone="${tone}">
      <div style="font-weight:600; margin-bottom:0.25rem;">${tone.toUpperCase()}</div>
      <div style="font-size:0.85rem; color:var(--text-2);">${message}</div>
    </div>
  `);

  root.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(6px)";
  }, 2600);
  setTimeout(() => toast.remove(), 3200);
};
