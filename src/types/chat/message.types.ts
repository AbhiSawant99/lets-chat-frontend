export interface IMessage {
  id: string;
  from: string;
  message: string;
  status: "sent" | "seen";
  createdAt: string;
}
