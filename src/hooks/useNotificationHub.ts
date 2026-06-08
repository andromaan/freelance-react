import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { notificationHubService } from "../services/signalr/notificationHubService";
import { tokenStorage } from "../services/auth/tokenStorage";
import { addNotification } from "../store/notificationSlice";
import type { NotificationVM } from "../types/notification.types";
import type { AppDispatch } from "../store";
import { getStatusText } from "../utils";
import { notificationApi } from "../services/notification/notificationApi";
import { bidsApi } from "../services/bids/bidsApi";
import { projectsApi } from "../services/projects/projectsApi";
import { quotesApi } from "../services/quotes/quotesApi";
import { chatApi } from "../services/chat/chatApi";
import { contractMilestonesApi } from "../services/contract-milestone/contractMilestoneApi";
import { contractsApi } from "../services/contracts/contractsApi";
import { walletApi } from "../services/wallet/walletApi";
import { disputesApi } from "../services/disputes/disputesApi";
import { reviewsApi } from "../services/reviews/reviewsApi";

export const useNotificationHub = (enabled: boolean) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
      dispatch(notificationApi.util.invalidateTags(["Notification"]));

      // Invalidate related API caches based on notification type
      switch (notification.type) {
        case "NewBidReceived":
        case "InterestedInYourBid":
        case "NotInterestedInYourBid":
          dispatch(bidsApi.util.invalidateTags(["Bid"]));
          dispatch(projectsApi.util.invalidateTags(["Project"]));
          break;
        case "NewQuoteReceived":
          dispatch(quotesApi.util.invalidateTags(["Quote"]));
          dispatch(projectsApi.util.invalidateTags(["Project"]));
          break;
        case "NewMessage":
          dispatch(chatApi.util.invalidateTags(["Chat"]));
          break;
        case "MilestoneStatusUpdated":
          dispatch(contractMilestonesApi.util.invalidateTags(["ContractMilestone"]));
          dispatch(contractsApi.util.invalidateTags(["Contract"]));
          break;
        case "ContractCreated":
          dispatch(contractsApi.util.invalidateTags(["Contract"]));
          break;
        case "PaymentReceived":
          dispatch(walletApi.util.invalidateTags(["Wallet"]));
          break;
        case "DisputeOpened":
          dispatch(disputesApi.util.invalidateTags(["Dispute"]));
          dispatch(contractsApi.util.invalidateTags(["Contract"]));
          break;
        case "ReviewLeft":
          dispatch(reviewsApi.util.invalidateTags(["Review"]));
          break;
        case "ProjectDeadlineReminder":
          dispatch(projectsApi.util.invalidateTags(["Project"]));
          break;
      }

      const label = getStatusText(notification.type);
      toast.info(`${label}: ${notification.message}`, {
        position: "bottom-right",
        autoClose: 5000,
        onClick: () => navigate("/notifications"),
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
