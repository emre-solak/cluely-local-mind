
import { useState } from "react";
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  PanelLeft
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileUploadZone } from "./FileUploadZone";

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface AppSidebarProps {
  currentChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
}

export function AppSidebar({ currentChatId, onChatSelect, onNewChat }: AppSidebarProps) {
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
    <Sidebar className={isCollapsed ? "w-12" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-3 border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-6 w-6" />
          {!isCollapsed && (
            <h1 className="text-sm font-semibold">Local AI</h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* New Chat Button */}
        <div className="mb-3">
          <Button
            onClick={onNewChat}
            className="w-full h-8 text-sm"
            size="sm"
          >
            <Plus className="w-3 h-3" />
            {!isCollapsed && <span className="ml-1">New Chat</span>}
          </Button>
        </div>

        {/* Chat History */}
        {!isCollapsed && (
          <SidebarGroup className="p-0">
            <SidebarGroupLabel className="text-xs px-2 mb-2">
              Recent Chats
            </SidebarGroupLabel>
            
            <SidebarGroupContent>
              <ScrollArea className="h-48">
                <SidebarMenu className="space-y-1">
                  {chats.map((chat) => (
                    <SidebarMenuItem key={chat.id}>
                      <SidebarMenuButton
                        isActive={currentChatId === chat.id}
                        onClick={() => onChatSelect(chat.id)}
                        className="p-2 h-auto"
                      >
                        <MessageSquare className="w-3 h-3 flex-shrink-0" />
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium truncate">
                              {chat.title}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(chat.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {chat.messageCount}
                          </Badge>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Knowledge Base */}
        {!isCollapsed && (
          <SidebarGroup className="p-0 mt-4">
            <SidebarGroupLabel className="text-xs px-2 mb-2">
              Knowledge Base
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <FileUploadZone />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-2 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-8 justify-center">
              <Settings className="w-4 h-4" />
              {!isCollapsed && (
                <span className="text-sm ml-2">Settings</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
