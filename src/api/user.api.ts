import request from "@/api";

export const getUserProfile = async () => {
  const response = await request("/user/profile", {
    method: "GET",
    credentials: "include",
  });

  return response;
};

export const checkUsernameAvailability = async (username: string) => {
  const response = await request(`/auth/check-username?username=${username}`, {
    method: "GET",
    credentials: "include",
  });

  return response;
};

export const updateUserProfile = async (formData: FormData) => {
  const response = await request("/user/update-user", {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  return response;
};
