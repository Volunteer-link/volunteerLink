import React, { createContext, ReactNode, useEffect, useState } from "react";
import useWebSocket from "../Hook/useWebSocket";
import { decodedCookie, getCookie } from "./cookie";
import { useLocation } from "react-router-dom";
interface WebsocketContextProps {
  children: ReactNode;
}
const WebsocketContext = createContext<WebSocket | null>(null);
// Provide Context
export const WebsocketProvider: React.FC<WebsocketContextProps> = ({
  children,
}) => {
  const { messages, sendMessage, isConnected, socket } = useWebSocket({
    url: process.env.REACT_APP_WS_URL ?? "abc",
  });

  return (
    <WebsocketContext.Provider value={socket.current}>
      {children}
    </WebsocketContext.Provider>
  );
};

export default WebsocketContext;
