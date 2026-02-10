import { formatCurrency, formatDate, formatNumber, formatPercent } from "../utils/helpers.js";
import { createElement } from "../utils/dom.js";

export const renderDashboardPage = (state) => {
  const data = state.data;
  if (!data) {
    return createElement(`<div class="card">Loading dashboard...</div>`);
  }

  const metrics = data.metrics
    .map((metric) => `
      <div class="card metric-card">
        <div style="color:var(--text-3); font-size:0.8rem;">${metric.label}</div>
        <div class="metric-value">${formatNumber(metric.value)}</div>
        <div class="metric-trend" style="color:${metric.delta >= 0 ? "#12d28a" : "#f46b6b"};">
          <span>${metric.delta >= 0 ? "^" : "v"}</span>
          <span>${formatPercent(Math.abs(metric.delta))} vs last week</span>
        </div>
      </div>
    `)
    .join("");

  const rows = data.pipeline
    .map((row) => `
      <tr>
        <td>${row.name}</td>
        <td>${row.owner}</td>
        <td>${formatCurrency(row.value)}</td>
        <td><span class="status-pill ${row.status}">${row.status.toUpperCase()}</span></td>
        <td>${formatDate(row.updated)}</td>
      </tr>
    `)
    .join("");

  const activity = data.activity
    .map((item) => `
      <div class="list-item">
        <div>
          <div style="font-weight:600;">${item.title}</div>
          <div style="font-size:0.8rem; color:var(--text-3);">${item.detail}</div>
        </div>
        <div class="mono">${formatDate(item.time)}</div>
      </div>
    `)
    .join("");

  return createElement(`
    <section class="hero card">
      <div>
        <div class="badge">Realtime</div>
        <h1 style="margin-top:0.75rem;">Operational posture is stable</h1>
        <p>SubioTG continuously scores your fleet and allocates risk budget across regions.</p>
        <div style="display:flex; gap:0.75rem; margin-top:1.25rem;">
          <button class="button primary">Create response runbook</button>
          <button class="button">View incident map</button>
        </div>
      </div>
      <div class="hero-card">
        <div style="font-weight:600; margin-bottom:0.75rem;">Risk budget remaining</div>
        <div style="font-size:2rem; font-weight:600;">${formatPercent(data.riskBudget)}</div>
        <div class="hero-stats">
          ${data.riskDetails.map((item) => `
            <div>
              <div style="font-size:0.8rem; color:var(--text-3);">${item.label}</div>
              <div style="font-weight:600;">${formatPercent(item.value)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    </section>

    <section class="grid-4">
      ${metrics}
    </section>

    <section class="grid-2">
      <div class="card">
        <div class="section-title">
          <div>
            <h3>Fleet performance</h3>
            <p>Throughput and saturation trends by region.</p>
          </div>
          <span class="badge">last 30 days</span>
        </div>
        <div class="chart-wrap">
          <canvas id="fleet-chart"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="section-title">
          <div>
            <h3>Automation health</h3>
            <p>Latest workflows and agent signals.</p>
          </div>
          <button class="button">Export</button>
        </div>
        ${activity}
      </div>
    </section>

    <section class="card">
      <div class="section-title">
        <div>
          <h3>Pipeline coverage</h3>
          <p>High-value programs with current operational status.</p>
        </div>
        <span class="badge">${data.pipeline.length} active</span>
      </div>
      <div style="overflow:auto;">
        <table class="table">
          <thead>
            <tr>
              <th>Program</th>
              <th>Owner</th>
              <th>Value</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    </section>
  `);
};
