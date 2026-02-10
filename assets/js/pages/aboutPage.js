import { createElement } from "../utils/dom.js";

export const renderAboutPage = () => createElement(`
  <section class="grid-2">
    <div class="card stack">
      <div>
        <h2>About SubioTG</h2>
        <p>SubioTG Ops Console is an internal-grade platform for orchestrating automation, policy, and reliability workflows across distributed teams.</p>
      </div>
      <div>
        <div class="badge">Platform pillars</div>
        <div class="stack" style="margin-top:1rem;">
          <div class="list-item">
            <div>
              <div style="font-weight:600;">Reliability orchestration</div>
              <div style="font-size:0.8rem; color:var(--text-3);">Coordinate playbooks, approvals, and signals.</div>
            </div>
            <span class="kbd">SLO</span>
          </div>
          <div class="list-item">
            <div>
              <div style="font-weight:600;">Governance workflows</div>
              <div style="font-size:0.8rem; color:var(--text-3);">Map ownership and policy coverage in one surface.</div>
            </div>
            <span class="kbd">SOC2</span>
          </div>
          <div class="list-item">
            <div>
              <div style="font-weight:600;">AI-assisted routing</div>
              <div style="font-size:0.8rem; color:var(--text-3);">Triage incidents with context-aware automation.</div>
            </div>
            <span class="kbd">ML</span>
          </div>
        </div>
      </div>
    </div>
    <div class="card stack">
      <div>
        <h2>Why static?</h2>
        <p>Our frontend is entirely static, enabling air-gapped deployments and zero-backend previews across GitHub Pages or local file access.</p>
      </div>
      <div class="card" style="background: var(--surface-2);">
        <div style="font-weight:600;">Release cadence</div>
        <p style="margin-top:0.5rem;">Weekly improvements and monthly capability drops.</p>
        <div class="list-item">
          <span>Last release</span>
          <span class="mono">v2.14.0</span>
        </div>
        <div class="list-item">
          <span>Design system</span>
          <span class="mono">Nebula UI</span>
        </div>
      </div>
      <div>
        <h3>Key outcomes</h3>
        <p>Teams reduce recovery time by 32% and audit prep by 55% after onboarding the console.</p>
      </div>
    </div>
  </section>
`);
