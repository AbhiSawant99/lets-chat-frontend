import {
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import type { IChat } from "@/types/chat/chat.types";
import { searchChats } from "@/api/chat.api";
import ChatUsersCard from "@/components/chat/chat-user-card";
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
  const [loadingChatList, setLoadingChatList] = useState(false);
  const [firstSearchComplete, setFirstSearchComplete] = useState(false);

  useEffect(() => {
    if (search.length > 2) {
      setLoadingChatList(true);
      searchChats(search).then((response) => {
        setSearchResult(response);
        setFirstSearchComplete(true);
        setLoadingChatList(false);
      });
    }
  }, [search]);

  const showResult = () => {
    if (!search) {
      return (
        <div>
          <Typography
            sx={{
              textAlign: "center",
              color: "action.active",
              marginTop: "1rem",
            }}
          >
            Search a username to get results
          </Typography>
        </div>
      );
    } else if (
      firstSearchComplete &&
      !loadingChatList &&
      search &&
      searchResult.length == 0
    ) {
      return (
        <div>
          <Typography
            sx={{
              textAlign: "center",
              color: "action.active",
              marginTop: "1rem",
            }}
          >
            {`Could not find any result for ${search}`}
          </Typography>
        </div>
      );
    } else if (firstSearchComplete && search && searchResult.length > 0) {
      return (
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
      );
    } else {
      return <></>;
    }
  };

  return (
    <div className="add-new-chat-container">
      <TextField
        type="text"
        className="chat-list-search"
        placeholder="Search by name, username"
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
      {loadingChatList && (
        <LinearProgress
          sx={{ m: "0.5rem", borderRadius: "1rem", mb: "0rem" }}
        />
      )}
      {(!loadingChatList || firstSearchComplete) && showResult()}
    </div>
  );
};

export default AddNewChat;
