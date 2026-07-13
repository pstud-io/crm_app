export type AuthSliceState = {
  token: string | null;
  isAuthenticated: boolean;
};

export const initialAuthSliceState: AuthSliceState = {
  token: null,
  isAuthenticated: false,
};
