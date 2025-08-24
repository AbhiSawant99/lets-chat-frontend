export const searchChats = async (
  search: string,
  page?: string,
  size?: string
) => {
  return await fetch(
    `http://localhost:3000/chat/search-users?search=${search}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );
};

export const getChat = async (chatId: string) => {
  return await fetch(`http://localhost:3000/chat/get-chat?chatId=${chatId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};
