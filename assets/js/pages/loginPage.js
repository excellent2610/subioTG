import { createElement } from "../utils/dom.js";

export const renderLoginPage = () => createElement(`
  <section class="auth-grid">
    <div class="card auth-card">
      <div class="auth-header">
        <h2>Welcome back</h2>
        <p>Sign in to manage your subscriptions and analytics.</p>
      </div>
      <form id="login-form" class="form-stack">
        <label class="form-field">
          <span>Email</span>
          <input name="email" type="email" placeholder="you@subio.io" required />
        </label>
        <label class="form-field">
          <span>Password</span>
          <input name="password" type="password" placeholder="••••••••" minlength="6" required />
        </label>
        <button class="button primary full" type="submit">Sign in</button>
        <button id="forgot-password" class="button ghost full" type="button">Forgot password</button>
      </form>
    </div>
    <div class="card auth-aside">
      <h3>SUBIO Platform</h3>
      <p>Secure access, premium tiers, and analytics for bot operators.</p>
      <ul class="feature-list">
        <li>Premium plans with auto-renewal</li>
        <li>Activity dashboards and payment history</li>
        <li>Support tickets with SLA tracking</li>
      </ul>
      <a class="button pill" href="#register">Create account</a>
    </div>
  </section>
`);
