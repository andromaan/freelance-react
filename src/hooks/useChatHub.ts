import { useEffect, useState, useCallback, useRef } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { tokenStorage } from "../services/auth/tokenStorage";
import type { MessageVM } from "../types/chat.types";
import { toast } from "react-toastify";
import APP_ENV from "../env";

export const useChatHub = (contractId: string, initialMessages: MessageVM[]) => {
  const [messages, setMessages] = useState<MessageVM[]>(initialMessages);
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<HubConnection | null>(null);

  // Sync initialMessages to state when it loads, using stringify to avoid infinite loops on reference changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [JSON.stringify(initialMessages)]);

  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token || !contractId) return;

    let isMounted = true;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${APP_ENV.API_URL}/chat`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = newConnection;

    newConnection.on("ReceiveMessage", (message: MessageVM) => {
      if (isMounted) setMessages((prev) => [...prev, message]);
    });

    newConnection.on("MessageEdited", (updatedMessage: MessageVM) => {
      if (isMounted) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === updatedMessage.id ? updatedMessage : msg))
        );
      }
    });

    newConnection.on("MessageDeleted", (messageId: string) => {
      if (isMounted) setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    });

    newConnection.on("ErrorMessage", (error: string) => {
      if (isMounted) toast.error(error);
    });

    newConnection
      .start()
      .then(() => {
        if (isMounted) {
          setIsConnected(true);
          return newConnection.invoke("JoinChat", contractId);
        }
      })
      .catch((err) => {
        if (isMounted && err.name !== 'AbortError' && !err.message?.includes('stopped during negotiation')) {
          console.error("SignalR Connection Error: ", err);
          toast.error("Failed to connect to chat");
        }
      });

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        connectionRef.current.invoke("LeaveChat", contractId).catch(() => {});
        connectionRef.current.stop();
        connectionRef.current = null;
        setIsConnected(false);
      }
    };
  }, [contractId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!connectionRef.current || !isConnected) return;
      try {
        await connectionRef.current.invoke("SendMessage", contractId, text);
      } catch (err: any) {
        toast.error("Failed to send message");
        console.error(err);
      }
    },
    [contractId, isConnected]
  );

  const editMessage = useCallback(
    async (messageId: string, newText: string) => {
      if (!connectionRef.current || !isConnected) return;
      try {
        await connectionRef.current.invoke("EditMessage", contractId, messageId, newText);
      } catch (err: any) {
        toast.error("Failed to edit message");
        console.error(err);
      }
    },
    [contractId, isConnected]
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      if (!connectionRef.current || !isConnected) return;
      try {
        await connectionRef.current.invoke("DeleteMessage", contractId, messageId);
      } catch (err: any) {
        toast.error("Failed to delete message");
        console.error(err);
      }
    },
    [contractId, isConnected]
  );

  return { messages, isConnected, sendMessage, editMessage, deleteMessage };
};
