import type { SyntheticEvent } from "react";
import "./LoginPage.css";

type Props = {
  username: string;
  password: string;
  loading: boolean;
  error: string | null;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
};

export default function LoginPage({
  username,
  password,
  loading,
  error,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}: Props) {
  return (
    <div className="login-page">
      <form className="login-form" onSubmit={onSubmit}>
        <h1>Login</h1>
        <p>Use demo-user / password123</p>
        <input
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={loading} className="primary-btn">
          {loading ? "Signing in..." : "Sign in"}
        </button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
