import React, { useEffect, useState, type ReactNode } from "react";
import {
  AppContext,
  type AuthUser,
} from "../../types/app-provider/app-context";
import { useNavigate } from "react-router-dom";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | undefined>();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth/user", {
          credentials: "include",
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          localStorage.setItem("user", JSON.stringify(userData.user));
        } else {
          throw new Error("Failed to fetch user");
        }
      } catch (err) {
        console.error(err);
        setUser(undefined);
        localStorage.removeItem("user");
        navigate("/");
      }
    };

    const localUser = localStorage.getItem("user");
    if (!localUser) {
      fetchUser();
    } else {
      setUser(JSON.parse(localUser));
    }
  }, []);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
