import request from "@/api";
import type { IChat } from "@/types/chat/chat.types";

export const searchChats = async (search: string): Promise<IChat[]> => {
  const response = await request(`/chat/search-users?search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return response;
};

export const getChat = async (chatId: string): Promise<IChat> => {
  const response = await request(`/chat/get-chat?chatId=${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return response;
};
