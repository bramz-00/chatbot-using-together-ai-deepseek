import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

const socket: Socket = io("http://localhost:3000");

const App: React.FC = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false); 
  const botBuffer = useRef("");

  useEffect(() => {
    socket.on("bot_message", (token: string) => {
      setIsTyping(true);
      botBuffer.current += token;
      setChat((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "bot", text: botBuffer.current };
        return updated;
      });
    });

    socket.on("done", () => {
      setIsTyping(false);
      botBuffer.current = "";
    });

    socket.on("error_message", (err: string) => {
      setChat((prev) => [...prev, { sender: "bot", text: err }]);
    });

    return () => {
      socket.off("bot_message");
      socket.off("done");
      socket.off("error_message");
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    setChat((prev) => [
      ...prev,
      { sender: "user", text: message },
      { sender: "bot", text: "" },
    ]);
    socket.emit("user_message", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">🤖 DeepSeek Chatbot</h1>

        <Card className="h-[500px] overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-4 space-y-2 overflow-y-auto">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={` my-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="text-sm text-gray-500 italic">Bot is typing...</div>
            )}
          </ScrollArea>
          <CardContent className="p-4 border-t flex items-center gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={isTyping}>
              {isTyping ? <Loader2 className="animate-spin w-4 h-4" /> : "Send"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default App;
