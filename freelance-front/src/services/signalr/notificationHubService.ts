import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import type { NotificationVM } from "../../types/notification.types";
import APP_ENV from "../../env";

const BASE_URL = APP_ENV.API_URL || "http://localhost:5000/api";
// Hub знаходиться на корені, а не під /api
const HUB_URL = BASE_URL + "/notifications";

type NotificationHandler = (notification: NotificationVM) => void;

class NotificationHubService {
  private connection: HubConnection | null = null;

  build(getToken: () => string | null): void {
    // Idempotent — do not recreate if a connection already exists.
    // React StrictMode runs effects twice; without this guard a second
    // HubConnection is created and the first one (which the server already
    // knows about) ends up with no handlers registered.
    if (this.connection) return;

    this.connection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        // JWT токен передається як query param (стандарт для SignalR + WebSocket)
        accessTokenFactory: () => getToken() ?? "",
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
  }

  async start(): Promise<void> {
    if (!this.connection) return;
    if (this.connection.state === HubConnectionState.Connected) return;
    try {
      await this.connection.start();
    } catch (err) {
      console.error("[SignalR] Connection failed:", err);
    }
  }

  async stop(): Promise<void> {
    if (
      this.connection &&
      this.connection.state !== HubConnectionState.Disconnected
    ) {
      await this.connection.stop();
    }
  }

  onNotification(handler: NotificationHandler): void {
    this.connection?.on("ReceiveNotification", handler);
  }

  offNotification(handler: NotificationHandler): void {
    this.connection?.off("ReceiveNotification", handler);
  }

  get state(): HubConnectionState | null {
    return this.connection?.state ?? null;
  }
}

// Singleton
export const notificationHubService = new NotificationHubService();
