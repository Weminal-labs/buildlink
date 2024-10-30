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

interface Message {
  id: string;
  content: string | React.ReactNode;
  sender: "user" | "assistant";
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

const KEYWORD = "NEAR";

const ActionCard = ({ word }: { word: string }) => (
  <div className="p-4 bg-primary text-primary-foreground rounded-lg">
    <h3 className="font-bold mb-2">Action for: {word}</h3>
    <p>This is a custom action for the keyword {word}.</p>
  </div>
);

export default function EnhancedChatApp() {
  const { open } = useSidebar();
  const [chats, setChats] = useState<Chat[]>([
    {
      id: "1",
      title: "Please give me the top protocol for staking on Near",
      messages: [
        {
          id: "1",
          content: "Please give me the top protocol for staking on Near",
          sender: "user",
        },
        {
          id: "2",
          content: [
            "# Top Protocols for Staking on NEAR\n\n",
            "- **LiNEAR Protocol**: LiNEAR Protocol offers liquid staking on NEAR, enabling users to stake NEAR tokens and receive stNEAR tokens. This allows users to earn around 10% APY while still participating in NEAR's DeFi ecosystem with their staked tokens.\n\n",
            "- **Meta Pool**: Meta Pool provides liquid staking on NEAR, allowing users to stake NEAR and receive stNEAR, a liquid staking token. Users can earn rewards of approximately 10% APY, and the protocol integrates well with NEAR-based DeFi platforms.\n\n",
            "- **Everstake**: Everstake is a popular staking provider for NEAR, enabling users to delegate their tokens with a minimum of 5 NEAR and a maximum of 5,000 NEAR. This pool offers staking rewards and is known for its secure infrastructure and transparent operations.",
          ].join(""),
          sender: "assistant",
        },
      ],
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState<string | null>("1");
  const [inputMessage, setInputMessage] = useState("");
  const [showActionTab, setShowActionTab] = useState(false);

  const currentChat = useMemo(
    () => chats.find((chat) => chat.id === currentChatId),
    [chats, currentChatId]
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

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

      setTimeout(async () => {
          const payload = {
            chat_history: updatedChats.find(chat => chat.id === chatId)?.messages.map(msg => ({
                content: msg.content,
                role: msg.sender
            })) || [],
            question: inputMessage + " and help me markdown keyword of protocol"
        };
        const response = await fetch('http://localhost:3001/api/answer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload, null, 2)
        });
        const data = await response.json();
        console.log(data.keywords[0].keyword)
        const botResponse: Message = {
          id: Date.now().toString(),
          content: `**${data.keywords[0].keyword}** is mentioned here.`,
          sender: "assistant",
        };
        const updatedChatsWithBotResponse = updatedChats.map((chat) =>
          chat.id === chatId
            ? { ...chat, messages: [...chat.messages, botResponse] }
            : chat
        );
        setChats(updatedChatsWithBotResponse);
      }, 1000);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  useEffect(() => {
    if (
      currentChat?.messages.some(
        (message) =>
          message.sender === "assistant" &&
          typeof message.content === "string" &&
          message.content.includes(KEYWORD)
      )
    ) {
      setShowActionTab(true);
    } else {
      setShowActionTab(false);
    }
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