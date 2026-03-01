import type { LocaleOption } from "../types/locale";

export const LOCALE_OPTIONS: LocaleOption[] = [
  { label: "GBP (£)", locale: "en-GB", currency: "GBP" },
  { label: "USD ($)", locale: "en-US", currency: "USD" },
  { label: "EUR (€)", locale: "fr-FR", currency: "EUR" },
  { label: "JPY (¥)", locale: "ja-JP", currency: "JPY" },
];

export const DEFAULT_LOCALE = LOCALE_OPTIONS[1]; // US

export function findLocaleOption(localeValue?: string | null): LocaleOption {
  return (
    LOCALE_OPTIONS.find((option) => option.locale === localeValue) ??
    DEFAULT_LOCALE
  );
}
