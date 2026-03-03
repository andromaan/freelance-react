// Валюти Stripe, які не мають дробової частини (передається сума без множення на 100)
export const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "GNF",
  "ISK",
  "JPY",
  "KMF",
  "KRW",
  "MGA",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

export const PRESET_AMOUNTS = [100, 250, 500, 1000, 2000];

/** Конвертує суму у найменший грошовий підрозділ для Stripe */
export function toStripeAmount(amount: number, currency: string): number {
  if (ZERO_DECIMAL_CURRENCIES.has(currency.toUpperCase())) {
    return Math.round(amount);
  }
  return parseFloat(amount.toFixed(2));
}

/** Форматує суму з відповідною валютою */
export function formatCurrencyAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: currency || "UAH",
    maximumFractionDigits: 2,
  }).format(amount);
}
