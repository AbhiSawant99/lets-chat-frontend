import request from "@/api";

export const requestLogin = async (email: string, password: string) => {
  const response = await request("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  return response;
};

export const requestSignup = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await request("/auth/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    credentials: "include",
  });

  return response;
};

export const requestSaveDetails = async (payload: FormData) => {
  const response = await request("/auth/sign-final-step", {
    method: "POST",
    body: payload,
    credentials: "include",
  });

  return response;
};

export const logout = async () => {
  const response = await request("/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  return response;
};

export const getAuthUser = async () => {
  const response = await request("/auth/user", {
    credentials: "include",
  });

  return response;
};
