import { createElement } from "../utils/dom.js";

export const renderSettingsPage = (state) => {
  const prefs = state.preferences;
  return createElement(`
    <section class="grid-2">
      <div class="card stack">
        <div>
          <h2>Workspace controls</h2>
          <p>Manage how SubioTG agents sync operational data across regions.</p>
        </div>
        <div class="setting-row">
          <div>
            <div style="font-weight:600;">Realtime notifications</div>
            <div style="font-size:0.85rem; color:var(--text-3);">Push alerts for severity 2+</div>
          </div>
          <button class="toggle" data-pref="notifications">${prefs.notifications ? "Enabled" : "Disabled"}</button>
        </div>
        <div class="setting-row">
          <div>
            <div style="font-weight:600;">Auto-sync agents</div>
            <div style="font-size:0.85rem; color:var(--text-3);">Deploy playbooks when drift detected</div>
          </div>
          <button class="toggle" data-pref="autoSync">${prefs.autoSync ? "Enabled" : "Disabled"}</button>
        </div>
        <div class="setting-row">
          <div>
            <div style="font-weight:600;">Data region</div>
            <div style="font-size:0.85rem; color:var(--text-3);">Primary storage for audit trails</div>
          </div>
          <select class="button" data-pref="dataRegion">
            <option value="us-east-1" ${prefs.dataRegion === "us-east-1" ? "selected" : ""}>US East (N. Virginia)</option>
            <option value="eu-central-1" ${prefs.dataRegion === "eu-central-1" ? "selected" : ""}>EU Central (Frankfurt)</option>
            <option value="ap-southeast-1" ${prefs.dataRegion === "ap-southeast-1" ? "selected" : ""}>AP Southeast (Singapore)</option>
          </select>
        </div>
        <div style="display:flex; gap:0.75rem;">
          <button id="save-preferences" class="button primary">Save preferences</button>
          <button id="reset-preferences" class="button">Reset to default</button>
        </div>
      </div>

      <div class="card stack">
        <div>
          <h2>Security posture</h2>
          <p>Review the controls that keep your environment compliant.</p>
        </div>
        <div class="list-item">
          <div>
            <div style="font-weight:600;">MFA enforcement</div>
            <div style="font-size:0.8rem; color:var(--text-3);">Last reviewed 12 hours ago</div>
          </div>
          <span class="status-pill good">ACTIVE</span>
        </div>
        <div class="list-item">
          <div>
            <div style="font-weight:600;">Secrets rotation</div>
            <div style="font-size:0.8rem; color:var(--text-3);">Next rotation in 4 days</div>
          </div>
          <span class="status-pill warn">PENDING</span>
        </div>
        <div class="list-item">
          <div>
            <div style="font-weight:600;">IP allow-list</div>
            <div style="font-size:0.8rem; color:var(--text-3);">82 addresses verified</div>
          </div>
          <span class="status-pill good">COMPLIANT</span>
        </div>
        <div class="card" style="background: var(--surface-2); border-style:dashed;">
          <div style="font-weight:600;">Compliance snapshot</div>
          <p style="margin-top:0.5rem;">Generated report available for SOC2 Type II export.</p>
          <button class="button">Download report</button>
        </div>
      </div>
    </section>
  `);
};
