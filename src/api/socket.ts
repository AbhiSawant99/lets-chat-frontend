import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  withCredentials: true,
  autoConnect: false,
});

export const getRoomId = (senderId: string, receiverId: string) => {
  //todo: will go in utils
  const roomids = [senderId, receiverId].sort();
  return `room_${roomids[0]}_${roomids[1]}`;
};
