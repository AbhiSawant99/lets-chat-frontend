export interface IMessage {
  id: string;
  chatId: string;
  from: string;
  message: string;
  status: "sent" | "seen" | "deleted";
  readBy: string[];
  createdAt: string;
}
