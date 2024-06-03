import { createContext } from 'react';

export const AuthContext = createContext({
  authenticated: false,
  onAuthenticationSuccess: () => {},
});

export default AuthContext.Provider;
