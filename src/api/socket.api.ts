import { BASE_URL } from "@/api";
import { io } from "socket.io-client";

export const socket = io(BASE_URL, {
  withCredentials: true,
  autoConnect: false,
});

socket.on("connect_error", (err) => {
  if (err.message === "TokenExpired") {
    alert("Session expired. Please login again.");
    localStorage.removeItem("user");
    window.location.href = "/";
  }
});
