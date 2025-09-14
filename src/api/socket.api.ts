import { BASE_URL } from "@/api";
import { logout } from "@/api/auth.api";
import { io } from "socket.io-client";

export const socket = io(BASE_URL, {
  withCredentials: true,
  transports: ["polling", "websocket"],
  autoConnect: false,
  secure: true,
});

socket.on("connect_error", () => {
  alert("Session expired. Please login again.");
  logout();
});
