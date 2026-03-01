import type { LocaleOption } from "../types/locale";

export const LOCALE_OPTIONS: LocaleOption[] = [
  { label: "UK", locale: "en-GB", currency: "GBP" },
  { label: "US", locale: "en-US", currency: "USD" },
  { label: "France", locale: "fr-FR", currency: "EUR" },
  { label: "Japan", locale: "ja-JP", currency: "JPY" },
];

export const DEFAULT_LOCALE = LOCALE_OPTIONS[1]; // US

export function findLocaleOption(localeValue?: string | null): LocaleOption {
  return (
    LOCALE_OPTIONS.find((option) => option.locale === localeValue) ??
    DEFAULT_LOCALE
  );
}
