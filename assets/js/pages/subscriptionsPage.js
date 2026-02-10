import { createElement } from "../utils/dom.js";

export const renderSubscriptionsPage = (state) => {
  const plans = [
    { name: "Basic", price: 9, features: ["Core analytics", "1 bot workspace", "Community support"] },
    { name: "Pro", price: 19, features: ["Advanced analytics", "3 bot workspaces", "Priority support"] },
    { name: "Premium", price: 49, features: ["Unlimited bots", "Custom automations", "Dedicated success"] }
  ];

  const subs = state.subscriptions || [];
  const payments = state.payments || [];

  return createElement(`
    <section class="grid-3">
      ${plans.map((plan) => `
        <div class="card plan-card">
          <div class="plan-header">
            <h3>${plan.name}</h3>
            <div class="plan-price">$${plan.price}<span>/mo</span></div>
          </div>
          <ul class="plan-list">
            ${plan.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
          <button class="button primary full" data-plan="${plan.name}">Upgrade to ${plan.name}</button>
        </div>
      `).join("")}
    </section>

    <section class="card">
      <div class="section-title">
        <div>
          <h3>Active subscriptions</h3>
          <p>Manage renewals and payment methods.</p>
        </div>
      </div>
      <div class="stack">
        ${subs.length ? subs.map((sub) => `
          <div class="list-item">
            <div>
              <div style="font-weight:600;">${sub.plan}</div>
              <div style="font-size:0.8rem; color:var(--text-3);">Renews ${sub.renewal}</div>
            </div>
            <div class="subscription-actions">
              <span class="status-pill ${sub.status === "Active" ? "good" : "warn"}">${sub.status}</span>
              <button class="button danger" data-cancel="${sub.id}">Cancel</button>
            </div>
          </div>
        `).join("") : `<p>No subscriptions found.</p>`}
      </div>
    </section>

    <section class="card">
      <div class="section-title">
        <div>
          <h3>Payment history</h3>
          <p>Recent transactions and status updates.</p>
        </div>
      </div>
      <div style="overflow:auto;">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${payments.length ? payments.map((payment) => `
              <tr>
                <td>${payment.id}</td>
                <td>$${payment.amount}</td>
                <td>${payment.date}</td>
                <td>${payment.method}</td>
                <td>${payment.status}</td>
              </tr>
            `).join("") : `<tr><td colspan="5">No payments recorded.</td></tr>`}
          </tbody>
        </table>
      </div>
    </section>
  `);
};
