const planSelect = document.getElementById("plan-select");
const billingSelect = document.getElementById("billing-cycle");
const currencySelect = document.getElementById("currency");
const previewAmount = document.getElementById("preview-amount");
const previewNote = document.getElementById("preview-note");

if (planSelect && billingSelect && currencySelect && previewAmount) {
  const rates = {
    USD: 1,
    EUR: 0.92,
    UAH: 38.2
  };

  const formatCurrency = (value, currency) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);

  const updatePreview = () => {
    const selected = planSelect.options[planSelect.selectedIndex];
    const basePrice = Number(selected.dataset.price || 0);
    const cycle = billingSelect.value;
    const currency = currencySelect.value;
    const multiplier = cycle === "yearly" ? 10 : 1;
    const usdTotal = basePrice * multiplier;
    const converted = usdTotal * (rates[currency] || 1);
    previewAmount.textContent = formatCurrency(converted, currency);
    previewNote.textContent = cycle === "yearly" ? "Yearly payment (10x monthly)" : "Monthly payment";
  };

  planSelect.addEventListener("change", updatePreview);
  billingSelect.addEventListener("change", updatePreview);
  currencySelect.addEventListener("change", updatePreview);
  updatePreview();
}
