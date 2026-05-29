import APP_ENV from "../env";

export const getStatusText = (s: string) => s.split(/(?=[A-Z])/).join(" ");

export const userImageUrl = (imgPath: string) => {
    if (imgPath.startsWith("http://") || imgPath.startsWith("https://")) {
        return imgPath;
    }

    return `${APP_ENV.API_URL}/${imgPath}`;
}