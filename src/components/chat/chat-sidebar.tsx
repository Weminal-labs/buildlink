"use client";

import { ModeToggle } from "@/components/common/mode-toggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, MessageCircle, Trash2 } from "lucide-react";

interface ChatHistory {
  id: string;
  title: string;
}

interface ChatSidebarProps {
  chatHistory: ChatHistory[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
}

export function ChatSidebar({
  chatHistory,
  onNewChat,
  onSelectChat,
}: ChatSidebarProps) {
  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold mb-4">BuildLink</h1>
        <Button className="w-full flex items-center gap-2" onClick={onNewChat}>
          <Plus size={16} />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <SidebarMenu>
            {chatHistory.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  onClick={() => onSelectChat(chat.id)}
                  className="w-full justify-start mb-1 px-4"
                >
                  <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="truncate overflow-hidden text-ellipsis w-full">
                    {chat.title}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <ModeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
