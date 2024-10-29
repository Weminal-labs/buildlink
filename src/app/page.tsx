"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import ChatHeader from "@/components/chat/chat-header";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MOCK_CHAT } from "@/app/data";
import { AutoResizeTextarea } from "@/components/common/auto-resize-textarea";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

export default function ChatApp() {
  const { open } = useSidebar();
  const [chats, setChats] = React.useState<Chat[]>(MOCK_CHAT as any);
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null);
  const [inputMessage, setInputMessage] = React.useState("");

  const currentChat = React.useMemo(
    () => chats.find((chat) => chat.id === currentChatId),
    [chats, currentChatId]
  );

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `New Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats([newChat, ...chats]); // Thêm cuộc trò chuyện mới vào đầu mảng
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (id: string) => {
    setCurrentChatId(id);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      let chatId = currentChatId;
      let updatedChats = [...chats];

      if (!chatId) {
        // Tạo cuộc trò chuyện mới nếu chưa có cuộc trò chuyện nào được chọn
        const newChat: Chat = {
          id: Date.now().toString(),
          title: inputMessage.trim(), // Sử dụng tin nhắn đầu tiên làm tiêu đề
          messages: [],
        };
        updatedChats = [newChat, ...updatedChats]; // Thêm cuộc trò chuyện mới vào đầu mảng
        chatId = newChat.id;
        setCurrentChatId(chatId);
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage,
        sender: "user",
      };

      updatedChats = updatedChats.map((chat) =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      );

      setChats(updatedChats);
      setInputMessage("");

      // Xử lý logic gửi message đến backend hoặc AI service
      // Sau đó thêm response vào mảng messages
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar
        chatHistory={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />
      <div className="flex-1 flex flex-col h-full items-center">
        <ChatHeader />
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all w-full  duration-700 ${
            open ? "" : "xl:w-[75vw]"
          }`}
        >
          <ScrollArea className="flex-1 p-4 transition-all duration-700">
            {currentChat?.messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === "user" ? "flex justify-end" : "flex"
                }`}
              >
                <div
                  className={`message-bubble inline-block p-2 rounded-lg max-w-6xl  ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground xl:max-w-3xl"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <AutoResizeTextarea
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 resize-none mr-2 min-h-[40px] max-h-[120px]"
                maxRows={5}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
