import React, { useEffect, useState, type ReactNode } from "react";
import { AppContext, type AuthUser } from "@/types/app-provider/app-context";
import { useNavigate } from "react-router-dom";
import { getAuthUser } from "@/api/auth.api";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | undefined>();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const navigate = useNavigate();

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (!localUser) {
      getAuthUser().then((response) => {
        if (response) {
          const userData = response;
          setUser(userData.user);
          localStorage.setItem("user", JSON.stringify(userData.user));
        } else {
          setUser(undefined);
          localStorage.removeItem("user");
          navigate("/");
          throw new Error("Failed to fetch user");
        }
      });
    } else {
      setUser(JSON.parse(localUser));
    }
  }, [navigate]);

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
