export type LoginResponse = {
  authenticated: boolean;
  token: string;
  username: string;
  locale: string | null;
  message?: string;
};
