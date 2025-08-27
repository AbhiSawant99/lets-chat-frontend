import { BASE_URL } from "@/api";

export default function getImageUrl(path?: string) {
  return `${BASE_URL}${path}`;
}
