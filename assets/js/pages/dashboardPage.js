import { formatCurrency, formatDate, formatNumber } from "../utils/helpers.js";
import { createElement } from "../utils/dom.js";

export const renderDashboardPage = (state) => {
  const data = state.data;
  if (!data) {
    return createElement(`<div class="card">Loading dashboard...</div>`);
  }

  const spendValue = formatCurrency(data.metrics?.[0]?.value ?? 0);

  const subscriptions = data.pipeline
    .map((row) => `
      <div class="subscription-card">
        <div class="subscription-head">
          <div>
            <div class="subscription-title">${row.name}</div>
            <div class="subscription-meta">Owner: ${row.owner}</div>
          </div>
          <div class="subscription-amount">${formatNumber(row.value)} USD</div>
        </div>
        <div class="subscription-body">
          <div class="subscription-chip">Monthly</div>
          <div class="subscription-info">
            <div>Next payment: ${formatDate(row.updated)}</div>
            <div>Status: <span class="status-pill ${row.status}">${row.status.toUpperCase()}</span></div>
          </div>
        </div>
        <div class="subscription-actions">
          <button class="button info">Edit</button>
          <button class="button danger">Remove</button>
          <button class="button primary">Paid</button>
        </div>
      </div>
    `)
    .join("");

  return createElement(`
    <section class="grid-2">
      <div class="card center-card">
        <div class="center-title">Розхід на місяць</div>
        <div class="center-value">${spendValue}</div>
      </div>
      <div class="card">
        <div class="section-title">
          <div>
            <h3>Валюта відображення</h3>
            <p>Оновіть вигляд фінансових даних.</p>
          </div>
        </div>
        <select class="button select-wide">
          <option selected>UAH (₴)</option>
          <option>USD ($)</option>
          <option>EUR (€)</option>
        </select>
      </div>
    </section>

    <section class="card">
      <div class="section-title">
        <div>
          <h3>Мої підписки</h3>
          <p>Керуйте активними сервісами та статусами.</p>
        </div>
      </div>
      <div class="filters-row">
        <input class="filter-input" type="text" placeholder="Пошук підписок..." />
        <input class="filter-input" type="text" placeholder="дд.мм.рррр" />
        <button class="button pill">Фільтр</button>
      </div>
      <div class="subscription-grid">
        ${subscriptions}
      </div>
    </section>

    <section class="card">
      <div class="section-title">
        <div>
          <h3>Витрати по місяцях</h3>
          <p>Огляд витрат по регіонах за період.</p>
        </div>
      </div>
      <div class="chart-wrap">
        <canvas id="fleet-chart"></canvas>
      </div>
    </section>
  `);
};
