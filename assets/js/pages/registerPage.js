import { createElement } from "../utils/dom.js";

export const renderRegisterPage = () => createElement(`
  <section class="auth-grid">
    <div class="card auth-card">
      <div class="auth-header">
        <h2>Create your account</h2>
        <p>Start managing premium bot features in minutes.</p>
      </div>
      <form id="register-form" class="form-stack">
        <label class="form-field">
          <span>Full name</span>
          <input name="name" type="text" placeholder="Alex Subio" required />
        </label>
        <label class="form-field">
          <span>Email</span>
          <input name="email" type="email" placeholder="you@subio.io" required />
        </label>
        <label class="form-field">
          <span>Password</span>
          <input name="password" type="password" minlength="6" required />
        </label>
        <label class="form-field">
          <span>Confirm password</span>
          <input name="passwordConfirm" type="password" minlength="6" required />
        </label>
        <button class="button primary full" type="submit">Create account</button>
        <a class="button ghost full" href="#login">Already have an account</a>
      </form>
    </div>
    <div class="card auth-aside">
      <h3>Secure onboarding</h3>
      <p>We use staged verification and automated checks for each bot operator.</p>
      <div class="stack">
        <div class="stat-card">
          <div class="stat-value">24/7</div>
          <div class="stat-label">Fraud monitoring</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">98%</div>
          <div class="stat-label">Email deliverability</div>
        </div>
      </div>
    </div>
  </section>
`);
