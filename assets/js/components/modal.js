import { qs } from "../utils/dom.js";

export const showModal = (contentHtml) => {
  const root = qs("#modal-root");
  if (!root) return;
  root.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      ${contentHtml}
    </div>
  `;
  root.classList.add("active");
  root.setAttribute("aria-hidden", "false");

  root.addEventListener("click", (event) => {
    if (event.target === root) {
      hideModal();
    }
  }, { once: true });
};

export const hideModal = () => {
  const root = qs("#modal-root");
  if (!root) return;
  root.classList.remove("active");
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = "";
};
