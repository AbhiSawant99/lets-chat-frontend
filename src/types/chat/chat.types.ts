import type { IMessage } from "./message.types";

export interface IChat {
  id: string;
  username: string;
  userId: string;
  online: boolean;
  lastMessage?: IMessage;
}
