import { uid } from "../utils/helpers.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUser = {
  id: "usr_demo",
  name: "Alex Subio",
  email: "alex@subio.dev",
  avatar: "assets/img/logo.svg",
  plan: "Pro",
  status: "Active"
};

const fallbackData = {
  metrics: [
    { label: "Active agents", value: 342, delta: 6.4 },
    { label: "Workflows running", value: 1284, delta: 3.1 },
    { label: "Policy coverage", value: 96, delta: 1.4 },
    { label: "Open incidents", value: 7, delta: -2.3 }
  ],
  riskBudget: 78.6,
  riskDetails: [
    { label: "Infra", value: 84.2 },
    { label: "Security", value: 76.4 },
    { label: "Compliance", value: 74.1 }
  ],
  chart: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"],
    series: [
      {
        label: "North America",
        data: [120, 148, 156, 176, 192],
        color: "#56c0ff",
        fill: "rgba(86,192,255,0.15)"
      },
      {
        label: "Europe",
        data: [90, 110, 123, 141, 151],
        color: "#8ce9b2",
        fill: "rgba(140,233,178,0.15)"
      }
    ]
  },
  pipeline: [
    { name: "Atlas Zero Trust", owner: "K. Tan", value: 420000, status: "good", updated: "2026-02-03" },
    { name: "Helios AI Routing", owner: "M. Lopez", value: 310000, status: "warn", updated: "2026-02-01" },
    { name: "Orion Controls", owner: "S. Ahmed", value: 275000, status: "good", updated: "2026-01-29" },
    { name: "Delta Runbooks", owner: "R. Patel", value: 198000, status: "critical", updated: "2026-01-27" },
    { name: "Nebula Compliance", owner: "Y. Kim", value: 365000, status: "good", updated: "2026-02-04" }
  ],
  activity: [
    { title: "Autonomous triage updated", detail: "Model retrained with 12k new alerts", time: "2026-02-05" },
    { title: "SLO breach resolved", detail: "Latency normalized in eu-central-1", time: "2026-02-04" },
    { title: "Policy pack applied", detail: "Zero trust enforcement for 18 services", time: "2026-02-03" },
    { title: "Runbook drift detected", detail: "4 workflows pending review", time: "2026-02-02" }
  ]
};

const mockSubscriptions = [
  { id: "sub_basic", plan: "Basic", price: 9, status: "Active", renewal: "2026-02-28" },
  { id: "sub_pro", plan: "Pro", price: 19, status: "Active", renewal: "2026-03-12" }
];

const mockPayments = [
  { id: "pay_1", amount: 19, date: "2026-02-01", method: "Stripe", status: "Paid" },
  { id: "pay_2", amount: 19, date: "2026-01-01", method: "Stripe", status: "Paid" },
  { id: "pay_3", amount: 9, date: "2025-12-01", method: "PayPal", status: "Paid" }
];

export const mockApiService = {
  async fetchDashboardData() {
    await sleep(160);
    try {
      const response = await fetch("data/mockData.json");
      if (!response.ok) {
        return fallbackData;
      }
      return response.json();
    } catch (error) {
      return fallbackData;
    }
  },
  async register(payload) {
    await sleep(220);
    return { ...mockUser, name: payload.name, email: payload.email };
  },
  async login(payload) {
    await sleep(180);
    if (!payload.email || !payload.password) {
      throw new Error("Email and password are required");
    }
    return { ...mockUser, email: payload.email };
  },
  async requestPasswordReset(email) {
    await sleep(200);
    if (!email) throw new Error("Email is required");
    return { status: "sent", email };
  },
  async updateProfile(payload) {
    await sleep(200);
    return { ...mockUser, ...payload };
  },
  async updatePassword() {
    await sleep(220);
    return { status: "updated" };
  },
  async listSubscriptions() {
    await sleep(160);
    return mockSubscriptions;
  },
  async listPayments() {
    await sleep(160);
    return mockPayments;
  },
  async createSubscription(plan) {
    await sleep(240);
    return { id: uid(), plan, price: plan === "Premium" ? 49 : plan === "Pro" ? 19 : 9, status: "Active", renewal: "2026-03-28" };
  },
  async cancelSubscription(id) {
    await sleep(200);
    return { id, status: "Canceled" };
  },
  async createSupportTicket(payload) {
    await sleep(200);
    return { id: uid(), ...payload, status: "Open", created: new Date().toISOString() };
  }
};
