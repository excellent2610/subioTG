import { createElement } from "../utils/dom.js";

export const renderSupportPage = (state) => {
  const tickets = state.supportTickets || [];
  return createElement(`
    <section class="grid-2">
      <div class="card">
        <div class="section-title">
          <div>
            <h3>Support request</h3>
            <p>Tell us about your issue or billing question.</p>
          </div>
        </div>
        <form id="support-form" class="form-stack">
          <label class="form-field">
            <span>Subject</span>
            <input name="subject" type="text" placeholder="Payment verification" required />
          </label>
          <label class="form-field">
            <span>Priority</span>
            <select name="priority" class="select-wide">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </label>
          <label class="form-field">
            <span>Message</span>
            <textarea name="message" rows="4" placeholder="Describe the issue..." required></textarea>
          </label>
          <button class="button primary" type="submit">Submit ticket</button>
        </form>
      </div>
      <div class="card">
        <div class="section-title">
          <div>
            <h3>Recent tickets</h3>
            <p>Statuses update in real time.</p>
          </div>
        </div>
        <div class="stack">
          ${tickets.length ? tickets.map((ticket) => `
            <div class="list-item">
              <div>
                <div style="font-weight:600;">${ticket.subject}</div>
                <div style="font-size:0.8rem; color:var(--text-3);">${ticket.created}</div>
              </div>
              <span class="status-pill ${ticket.status === "Open" ? "warn" : "good"}">${ticket.status}</span>
            </div>
          `).join("") : `<p>No tickets yet.</p>`}
        </div>
      </div>
    </section>
  `);
};
