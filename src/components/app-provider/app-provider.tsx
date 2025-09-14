import React, { useEffect, useState, type ReactNode } from "react";
import { AppContext, type AuthUser } from "@/types/app-provider/app-context";
import { getAuthUser, logout } from "@/api/auth.api";
import { useSnackbar } from "@/components/snackbar-provider/snackbar-context";
import { APIError } from "@/types/app-error";

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | undefined>();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const localUser = localStorage.getItem("user");
    if (!localUser) {
      getAuthUser()
        .then((response) => {
          const userData = response;
          setUser(userData.user);
          localStorage.setItem("user", JSON.stringify(userData.user));
        })
        .catch((err) => {
          if (err instanceof APIError) {
            console.error("API error:", err.status, err.message);
            if (err.status === 401) {
              logout();
            }
          } else {
            console.error("Unexpected error:", err);
          }
        });
    } else {
      setUser(JSON.parse(localUser));
    }
  }, [showSnackbar]);

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
