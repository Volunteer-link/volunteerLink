import { useState } from "react";
import useWebSocket from "../../Hook/useWebSocket";

const Chat = () => {
  const { messages, sendMessage, isConnected } = useWebSocket({
    url: "wss://dev.api.volunteer-link.site/ws/",
  });
  const [input, setInput] = useState("");

  return (
    <div>
      <h2>🔥 WebSocket Chat</h2>
      <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>📩 {msg}</p>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Nhập tin nhắn..."
      />
      <button
        onClick={() => {
          sendMessage(input);
          setInput("");
        }}
      >
        Gửi
      </button>
    </div>
  );
};

export default Chat;
