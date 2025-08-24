import { InputAdornment, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import type { IChat } from "../../../types/chat/chat.types";
import { searchChats } from "../../../api/chat";
import ChatUsersCard from "../chat-user-card";
import "./styles.css";

const AddNewChat = ({
  openChat,
  closeModal,
}: {
  openChat: (chat: IChat) => void;
  closeModal: () => void;
}) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<IChat[]>([]);

  useEffect(() => {
    if (search.length > 3) {
      searchChats(search).then(async (response) => {
        if (response.ok) {
          const chatList = await response.json();
          setSearchResult(chatList);
        } else {
          console.log("error : ");
        }
      });
    }
  }, [search]);

  return (
    <>
      <TextField
        type="text"
        className="chat-list-search"
        placeholder="Search a chat"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "2rem",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
        }}
      />
      {searchResult.length > 0 ? (
        <Stack className="search-chat-list custom-scroll">
          {searchResult.length > 0 &&
            searchResult
              .filter((c) => {
                if (search && search.length > 0) {
                  return c.username
                    .trim()
                    .toLocaleLowerCase()
                    .includes(search.trim().toLocaleLowerCase());
                } else {
                  return true;
                }
              })
              .map((chat, index) => (
                <ChatUsersCard
                  key={index}
                  chat={chat}
                  onClick={() => {
                    openChat(chat);
                    closeModal();
                  }}
                />
              ))}
        </Stack>
      ) : (
        <div>
          <p>Search a username to get results</p>
        </div>
      )}
    </>
  );
};

export default AddNewChat;
