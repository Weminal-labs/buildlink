"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import ChatHeader from "@/components/chat/chat-header";
import { AutoResizeTextarea } from "@/components/common/auto-resize-textarea";
import { CustomMarkdown } from "@/components/common/custom-markdown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LoadingMessage from "@/components/common/loading-message";
import { Chat, Message } from "@/types/chat";

export default function BuildlinkChat() {
  const { open } = useSidebar();
  const [currentChatId, setCurrentChatId] = useState<string | null>();
  const [inputMessage, setInputMessage] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);

  const currentChat = useMemo(
    () => chats.find((chat) => chat.id === currentChatId),
    [chats, currentChatId]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const defaultChat: Chat = {
      id: "default-chat",
      title: "Buildlink Chat Guide",
      messages: [
        {
          id: "default-message-1",
          content: "👋 Hi! I'm Buildlink's AI assistant.",
          sender: "assistant",
        },
        {
          id: "default-message-2",
          content: "How can I stake NEAR tokens?",
          sender: "user",
        },
        {
          id: "default-message-3",
          content:
            "To stake **NEAR** tokens, you can use **Linear Protocol** - one of the leading staking platforms on NEAR. Here are the steps:\n\n" +
            "1. Access your NEAR wallet\n" +
            "2. Connect to Linear Protocol\n" +
            "3. Choose the amount of NEAR to stake\n" +
            "4. Confirm the transaction\n\n" +
            "You will receive stNEAR tokens corresponding to your staked NEAR amount.",
          sender: "assistant",
        },
      ],
    };

    const storedChats = localStorage.getItem("chats");
    const storedChatId = localStorage.getItem("currentChatId");

    if (storedChats) {
      const parsedChats = JSON.parse(storedChats);
      const hasDefaultChat = parsedChats.some(
        (chat: Chat) => chat.id === defaultChat.id
      );

      let updatedChats = hasDefaultChat
        ? parsedChats
        : [defaultChat, ...parsedChats];
      setChats(updatedChats);

      if (storedChatId) {
        const chatExists = updatedChats.some(
          (chat: Chat) => chat.id === storedChatId
        );
        if (chatExists) {
          setCurrentChatId(storedChatId);
        } else {
          const newestChat = updatedChats.find(
            (chat: Chat) => chat.id !== defaultChat.id
          );
          setCurrentChatId(newestChat ? newestChat.id : defaultChat.id);
        }
      } else {
        setCurrentChatId(defaultChat.id);
      }
    } else {
      setChats([defaultChat]);
      setCurrentChatId(defaultChat.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
    localStorage.setItem("currentChatId", currentChatId || "");
  }, [chats, currentChatId]);

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: `New Chat ${chats.length + 1}`,
      messages: [],
    };
    setChats([newChat, ...chats]);
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
        const newChat: Chat = {
          id: Date.now().toString(),
          title: inputMessage.trim(),
          messages: [],
        };
        updatedChats = [newChat, ...updatedChats];
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
      setIsLoading(true);

      setTimeout(async () => {
        try {
          const payload = {
            chat_history:
              updatedChats
                .find((chat) => chat.id === chatId)
                ?.messages.map((msg) => ({
                  content: msg.content,
                  role: msg.sender,
                })) || [],
            question:
              inputMessage +
              " if the question is related to blockchain and NEAR help me bold keyword, If the question mentions Near Staking, mention Linear Protocol, of course there are other options too",
          };
          const response = await fetch(
            "https://buildlink.actionxapt.com/api/answer",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload, null, 2),
            }
          );
          const data = await response.json();
          const formattedText = data.formattedText
            .slice(1, -1)
            .replace(/\\n\\n/g, "\n\n")
            .replace(/\\n/g, "\n");
          const botResponse: Message = {
            id: Date.now().toString(),
            content: formattedText,
            sender: "assistant",
          };
          const updatedChatsWithBotResponse = updatedChats.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...chat.messages, botResponse] }
              : chat
          );
          setChats(updatedChatsWithBotResponse);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleDeleteChat = (id: string) => {
    setChats((prevChats) => {
      const newChats = prevChats.filter((chat) => chat.id !== id);

      // Nếu xóa chat đang được chọn
      if (id === currentChatId) {
        // Chọn chat đầu tiên nếu còn chat nào
        if (newChats.length > 0) {
          setCurrentChatId(newChats[0].id);
          localStorage.setItem("currentChatId", newChats[0].id);
        } else {
          setCurrentChatId(null);
          localStorage.setItem("currentChatId", "");
        }
      }

      return newChats;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <ChatSidebar
        chatHistory={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex-1 flex flex-col h-full items-center">
        <ChatHeader />
        <div
          className={`flex-1 flex flex-col overflow-hidden transition-all w-full duration-700 ${
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
                  className={`message-bubble inline-block p-2 rounded-lg max-w-6xl ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground xl:max-w-3xl"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {message.sender === "assistant" ? (
                    <CustomMarkdown content={message.content} />
                  ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content as string}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            {isLoading && <LoadingMessage />}
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
