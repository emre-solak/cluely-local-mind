
import { useState } from "react";
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  MoreHorizontal,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatSidebarProps {
  currentChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ currentChatId, onChatSelect, onNewChat }: ChatSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [chats] = useState<Chat[]>([
    {
      id: "1",
      title: "Document Analysis",
      lastMessage: "Can you analyze the quarterly report?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      messageCount: 12
    },
    {
      id: "2", 
      title: "Research Questions",
      lastMessage: "What are the key findings?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      messageCount: 8
    },
    {
      id: "3",
      title: "Meeting Notes Review",
      lastMessage: "Help me summarize these notes",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      messageCount: 5
    }
  ]);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-80"} collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between p-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <h1 className="text-lg font-semibold text-foreground">Local AI</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={onNewChat}
                className="h-8 w-8 p-0 hover:bg-primary/10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
          {isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewChat}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {!isCollapsed ? "Chat History" : ""}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <ScrollArea className="h-full">
              <SidebarMenu>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton
                      isActive={currentChatId === chat.id}
                      onClick={() => onChatSelect(chat.id)}
                      className="flex items-center gap-2 p-2 w-full"
                    >
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium truncate">
                              {chat.title}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatTimestamp(chat.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {chat.messageCount} messages
                            </Badge>
                          </div>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-2 p-2">
              <Settings className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && (
                <span className="text-sm">Settings</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
