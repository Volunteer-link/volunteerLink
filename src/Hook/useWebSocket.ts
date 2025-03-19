import React, { useEffect, useRef, useState } from "react";
import { getCookie } from "../ultils/cookie";

const useWebSocket = ({
  url,
  setNotiStatus,
}: {
  url: string;
  setNotiStatus?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const socket = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.current = new WebSocket(`${url}${getCookie("accessToken")}`);

    socket.current.addEventListener("open", () => {
      console.log("✅ WebSocket connected!");
      setIsConnected(true);
    });

    socket.current.addEventListener("message", (event) => {
      if (
        JSON.parse(event.data).message === "ping" &&
        socket.current &&
        socket.current.readyState === WebSocket.OPEN
      ) {
        console.log("🔴🟠🟡🟢🔵🟣🟤⚫⚪");
        socket.current.send("pong");
      }
    });

    socket.current.addEventListener("close", () => setIsConnected(false));
    socket.current.addEventListener("error", () => {});

    return () => {
      socket.current?.close();
    };
  }, [url]);

  const sendMessage = (message: string) => {
    if (socket.current && socket.current.readyState === WebSocket.OPEN) {
      socket.current.send(message);
    } else {
      console.warn("⚠️ WebSocket not connected!");
    }
  };

  return { messages, sendMessage, isConnected, socket };
};

export default useWebSocket;
