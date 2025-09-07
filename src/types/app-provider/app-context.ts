import { createContext } from "react";

export interface IAppContext {
  user?: AuthUser;
  setUser: (user: AuthUser) => void;
  theme?: "light" | "dark";
  toggleTheme: () => void;
}

export interface AuthUser {
  id: string;
  displayName: string;
  username?: string;
  email: string;
  photo?: string;
}

export interface AuthRequestUser {
  email: string;
  password: string;
}

export const AppContext = createContext<IAppContext | undefined>(undefined);
