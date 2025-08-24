"use server";

export const getChats = async () => {
  return await fetch("http://localhost:3000/chat/get-chats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};
