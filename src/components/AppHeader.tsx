import type { LocaleOption } from "../types/locale";
import { LOCALE_OPTIONS } from "../constants/locale";
import "./AppHeader.css";

type Props = {
  selectedLocale: LocaleOption;
  authenticatedUser: string;
  onLocaleChange: (localeLabel: string) => void;
  onLogout: () => void;
};

export default function AppHeader({
  selectedLocale,
  authenticatedUser,
  onLocaleChange,
  onLogout,
}: Props) {
  return (
    <header className="app-header">
      <h1 className="app-title">Package Manager</h1>
      <div className="locale-actions">
        <span style={{ marginRight: "0.5rem" }} className="signed-in-text">
          Currently located in:{" "}
        </span>
        <select
          className="locale-select"
          value={selectedLocale.label}
          onChange={(e) => onLocaleChange(e.target.value)}
        >
          {LOCALE_OPTIONS.map((option) => (
            <option key={option.label} value={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="user-actions">
        <span className="signed-in-text">Signed in as {authenticatedUser}</span>
        <button onClick={onLogout} className="secondary-btn">
          Logout
        </button>
      </div>
    </header>
  );
}
