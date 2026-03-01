import type { LocaleOption } from "../types/locale";

export function formatPrice(amount: number, locale: LocaleOption): string {
  return new Intl.NumberFormat(locale.locale, {
    style: "currency",
    currency: locale.currency,
    maximumFractionDigits: locale.currency === "JPY" ? 0 : 2,
  }).format(amount);
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  JPY: "¥",
};

export function getCurrencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}
