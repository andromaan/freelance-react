import APP_ENV from "../env";
import { format, isThisWeek, isToday, isYesterday } from "date-fns";
import { uk, enUS } from "date-fns/locale";
import type { UserVM } from "../types/user.types";
import i18n from "../i18n";
import type { TFunction } from "i18next";

export const getStatusText = (s: string) => s.split(/(?=[A-Z])/).join(" ");

export const userImageUrl = (imgPath: string) => {
  if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
    return imgPath;
  }

  return `${APP_ENV.API_URL}/${imgPath}`;
};

const isUk = () => i18n.language === "uk";
const getDateFnsLocale = () => (isUk() ? uk : enUS);

export function formatMessageDate(sentAt: string | Date): string {
  const date = new Date(sentAt);
  const locale = getDateFnsLocale();

  if (isToday(date)) {
    return format(date, "HH:mm", { locale });
  }

  if (isYesterday(date)) {
    const yesterday = i18n.language === "uk" ? "Вчора" : "Yesterday";
    return `${yesterday}, ${format(date, "HH:mm", { locale })}`;
  }

  if (isThisWeek(date, { weekStartsOn: isUk() ? 1 : 0 })) {
    return format(date, "EEEE, HH:mm", { locale });
  }

  return format(date, "MMM d, yyyy, HH:mm", { locale });
}

export const avatarLetters = (user: UserVM | undefined | null): string => {
  const source = user?.displayName || user?.email;
  if (!source) return "??";
  return Array.from(source).slice(0, 2).join("").toUpperCase();
};

export function formatDateLocalized(
  dateInput: Date | string,
  options?: Intl.DateTimeFormatOptions,
): string {
  try {
    const date = new Date(dateInput);
    const locale = i18n.language === "uk" ? "uk-UA" : "en-US";
    return date.toLocaleDateString(locale, options);
  } catch {
    return String(dateInput);
  }
}

export const formatNotificationTime = (
  iso: string,
  t: TFunction<"translation", undefined>,
) => {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return t("notifications.justNow");
  if (diffMin < 60) return t("notifications.minAgo", { count: diffMin });

  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return t("notifications.hoursAgo", { count: diffH });

  if (isYesterday(date)) return t("notifications.yesterday");

  const locale = i18n.language === "uk" ? "uk-UA" : "en-US";
  return date.toLocaleDateString(locale);
};