import { APIError } from "@/types/app-error";

export const BASE_URL = "https://lets-chat-f1wn.onrender.com";

async function request(endpoint: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      ...(options.headers || {}),
    },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null; // in case response has no body
  }

  if (!res.ok) {
    const message = data?.message || `HTTP ${res.status}`;
    throw new APIError(res.status, message);
  }

  return data;
}

export default request;
