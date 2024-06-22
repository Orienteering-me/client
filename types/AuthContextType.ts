export type AuthContextType = {
  refreshToken: string | null;
  setRefreshToken: (refreshToken: string | null) => void;
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
};
