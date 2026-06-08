import APP_ENV from "../env";
import { format, isThisWeek, isToday, isYesterday } from "date-fns";
import type { UserVM } from "../types/user.types";

export const getStatusText = (s: string) => s.split(/(?=[A-Z])/).join(" ");

export const userImageUrl = (imgPath: string) => {
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
        return imgPath;
    }

    return `${APP_ENV.API_URL}/${imgPath}`;
}

export function formatMessageDate(sentAt: string): string {
  const date = new Date(sentAt);

  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return `Yesterday, ${format(date, "HH:mm")}`;
  if (isThisWeek(date)) return `${format(date, "EEEE")}, ${format(date, "HH:mm")}`;

  return format(date, "dd.MM.yyyy, HH:mm");
}

export const avatarLetters = (user: UserVM | undefined | null) => user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "??");