import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import {
  loginUser,
  clearCurrentUser,
  updateUserLocale,
} from "../store/userSlice";

export function useAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const authenticatedUser = useSelector(
    (state: RootState) => state.user.currentUser,
  );
  const locale = useSelector((state: RootState) => state.user.locale);

  // Attempt login and return the server response on success.
  // Returns `null` on failure.
  const handleLogin = async (
    event: React.SyntheticEvent<HTMLFormElement>,
  ): Promise<{ token: string; locale: string | null } | null> => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await dispatch(loginUser({ username, password })).unwrap();
      setToken(data.token);
      setUsername("");
      setPassword("");
      return { token: data.token, locale: data.locale ?? null };
    } catch (loginError) {
      setError(
        typeof loginError === "string"
          ? loginError
          : "Unable to connect to the API",
      );
      setToken(null);
      dispatch(clearCurrentUser());
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    dispatch(clearCurrentUser());
  };

  const updateLocale = (username: string, locale: string) => {
    dispatch(updateUserLocale({ username, locale }));
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    token,
    setToken,
    loading,
    error,
    authenticatedUser,
    locale,
    handleLogin,
    handleLogout,
    updateLocale,
  };
}
