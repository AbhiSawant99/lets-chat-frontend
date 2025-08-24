import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
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
