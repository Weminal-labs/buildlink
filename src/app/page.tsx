"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import ChatHeader from "@/components/chat/chat-header";
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
  const [chats, setChats] = React.useState<Chat[]>([
    {
      id: "1",
      title: "What is NEAR Blockchain",
      messages: [
        {
          id: "1",
          content: "Can you explain what NEAR Blockchain is?",
          sender: "user",
        },
        {
          id: "2",
          content:
            "NEAR Protocol is a decentralized application platform designed to make apps usable on the web. It uses sharding technology to achieve scalability and is developer-friendly with features like human-readable account names instead of cryptographic wallet addresses.\n\nKey features of NEAR include:\n1. Proof-of-Stake consensus mechanism\n2. Sharding for scalability\n3. Low transaction fees\n4. Fast transaction finality\n5. Developer-friendly environment with WebAssembly-based smart contracts",
          sender: "bot",
        },
        {
          id: "3",
          content: "How does it compare to Ethereum?",
          sender: "user",
        },
        {
          id: "4",
          content:
            "NEAR and Ethereum are both smart contract platforms, but they have some key differences:\n\n1. Scalability: NEAR uses sharding to achieve higher throughput, while Ethereum is still in the process of implementing sharding.\n2. Consensus: NEAR uses Proof-of-Stake, while Ethereum is transitioning from Proof-of-Work to Proof-of-Stake.\n3. Developer Experience: NEAR aims to be more developer-friendly with easier-to-use tools and languages.\n4. Account System: NEAR uses human-readable account names, while Ethereum uses cryptographic addresses.\n5. Gas Fees: NEAR generally has lower and more predictable transaction fees compared to Ethereum.\n\nBoth have their strengths and are continuously evolving.",
          sender: "bot",
        },
      ],
    },
    {
      id: "2",
      title: "How Can I Stake on NEAR",
      messages: [
        {
          id: "1",
          content: "I want to stake my NEAR tokens. How can I do that?",
          sender: "user",
        },
        {
          id: "2",
          content:
            "Staking NEAR tokens is a great way to earn passive income and support the network. Here's a general guide on how to stake NEAR:\n\n1. Create a NEAR wallet: Visit wallet.near.org and set up an account.\n\n2. Acquire NEAR tokens: Buy NEAR from an exchange and transfer to your wallet.\n\n3. Choose a validator: Go to the 'Staking' tab in your NEAR wallet and select a validator.\n\n4. Stake your tokens: Enter the amount you want to stake and confirm the transaction.\n\n5. Wait for rewards: Staking rewards are distributed every epoch (about 12 hours).\n\nRemember, while staked, your tokens are locked. There's an unstaking period of about 3 days when you decide to withdraw.",
          sender: "bot",
        },
        {
          id: "3",
          content: "Are there any risks involved in staking?",
          sender: "user",
        },
        {
          id: "4",
          content:
            "Yes, there are some risks to consider when staking NEAR:\n\n1. Slashing: If the validator you chose misbehaves, a portion of your staked tokens could be slashed (penalized).\n\n2. Opportunity cost: Your staked tokens are locked and can't be used for other purposes.\n\n3. Unbonding period: There's a delay when unstaking, during which you can't access your tokens or earn rewards.\n\n4. Market risk: The value of NEAR could decrease while your tokens are staked.\n\n5. Validator risk: If your chosen validator goes offline or stops validating, you'll stop earning rewards until you switch to a new validator.\n\nDespite these risks, many consider staking a relatively safe way to earn passive income in crypto. Always do your own research and only stake what you can afford to lock up.",
          sender: "bot",
        },
      ],
    },
  ]);
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
    console.log("handleSendMessage called");
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

      console.log("Updated chats:", updatedChats);
      console.log("Current chat ID:", chatId);

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
                  className={`message-bubble inline-block p-2 rounded-lg max-w-md ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  {message.content.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      {index !== message.content.split("\n").length - 1 && (
                        <br />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </ScrollArea>
          <div className="p-4 border-t">
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 mr-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
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
