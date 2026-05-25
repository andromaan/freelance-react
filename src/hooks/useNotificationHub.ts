import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { notificationHubService } from "../services/signalr/notificationHubService";
import { tokenStorage } from "../services/auth/tokenStorage";
import { addNotification } from "../store/notificationSlice";
import type { NotificationVM } from "../types/notification.types";
import type { AppDispatch } from "../store";

export const useNotificationHub = (enabled: boolean) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // When disabled, stop the connection and bail out.
    if (!enabled) {
      notificationHubService.stop();
      return;
    }

    // build() is idempotent — safe to call on every effect run.
    notificationHubService.build(() => tokenStorage.getAccessToken());

    const handler = (notification: NotificationVM) => {
      dispatch(addNotification(notification));

      const label = notification.type.split(/(?=[A-Z])/).join(" ");
      toast.info(`${label}: ${notification.message}`, {
        position: "bottom-right",
        autoClose: 5000,
      });
    };

    notificationHubService.onNotification(handler);
    notificationHubService.start();

    // Only unregister THIS handler on cleanup — do NOT stop the connection.
    // Stopping here causes React StrictMode's second mount to trigger
    // continuous reconnection attempts on the original connection while
    // a second orphaned connection (with no handlers) is also created.
    return () => {
      notificationHubService.offNotification(handler);
    };
  }, [enabled, dispatch]);
};
