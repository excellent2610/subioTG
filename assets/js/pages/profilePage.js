import { createElement } from "../utils/dom.js";

export const renderProfilePage = (state) => {
  const user = state.user || { name: "Guest", email: "guest@subio.io", plan: "Free", status: "Inactive" };
  const subscriptions = state.subscriptions || [];
  return createElement(`
    <section class="grid-2">
      <div class="card profile-card">
        <div class="profile-header">
          <img class="avatar" src="${user.avatar || "assets/img/logo.svg"}" alt="Avatar" />
          <div>
            <h2>${user.name}</h2>
            <p>${user.email}</p>
            <div class="badge">${user.plan} plan · ${user.status}</div>
          </div>
        </div>
        <form id="profile-form" class="form-stack">
          <label class="form-field">
            <span>Display name</span>
            <input name="name" type="text" value="${user.name}" required />
          </label>
          <label class="form-field">
            <span>Email</span>
            <input name="email" type="email" value="${user.email}" required />
          </label>
          <button class="button primary" type="submit">Save profile</button>
        </form>
      </div>
      <div class="card profile-card">
        <h3>Security</h3>
        <form id="password-form" class="form-stack">
          <label class="form-field">
            <span>New password</span>
            <input name="password" type="password" minlength="6" required />
          </label>
          <label class="form-field">
            <span>Confirm password</span>
            <input name="passwordConfirm" type="password" minlength="6" required />
          </label>
          <button class="button ghost" type="submit">Update password</button>
        </form>
        <div class="divider"></div>
        <h4>Active subscriptions</h4>
        <div class="stack">
          ${subscriptions.length ? subscriptions.map((sub) => `
            <div class="list-item">
              <div>
                <div style="font-weight:600;">${sub.plan}</div>
                <div style="font-size:0.8rem; color:var(--text-3);">Renews ${sub.renewal}</div>
              </div>
              <span class="status-pill ${sub.status === "Active" ? "good" : "warn"}">${sub.status}</span>
            </div>
          `).join("") : `<p>No active subscriptions.</p>`}
        </div>
      </div>
    </section>
  `);
};
