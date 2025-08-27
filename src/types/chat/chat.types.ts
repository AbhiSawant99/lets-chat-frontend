import type { IMessage } from "./message.types";

export interface IChat {
  id: string;
  roomId: string;
  username: string;
  userId: string;
  online: boolean;
  photo?: string;
  lastMessage?: IMessage;
}
