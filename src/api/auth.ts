export const logout = async () => {
  const response = await fetch("http://localhost:3000/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  return response;
};
