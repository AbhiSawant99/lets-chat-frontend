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
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}

export default request;
