import type { IMessage } from "@/types/chat/message.types";
import { DateTime } from "luxon";

export function groupMessagesByDate(messages: IMessage[]) {
  const groups: Record<string, IMessage[]> = {};

  messages.forEach((msg) => {
    const dt = DateTime.fromISO(msg.createdAt);

    let label = dt.toFormat("dd LLL yyyy"); // fallback format

    if (dt.hasSame(DateTime.now(), "day")) {
      label = "Today";
    } else if (dt.hasSame(DateTime.now().minus({ days: 1 }), "day")) {
      label = "Yesterday";
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(msg);
  });

  return groups;
}
