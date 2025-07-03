import { useState } from "react";
import { 
  MessageSquare, 
  Plus, 
  Upload, 
  Settings, 
  Trash2,
  MoreHorizontal,
  Edit2,
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
    <Sidebar className={isCollapsed ? "w-14" : "w-80"} collapsible="icon">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between p-2">
          <SidebarTrigger className="h-8 w-8 hover:bg-primary/10" />
          {!isCollapsed && (
            <h1 className="text-lg font-semibold text-foreground">Local AI</h1>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* New Chat Button - Always visible */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onNewChat}
                  className="flex items-center gap-2 p-2 w-full justify-center"
                >
                  <Plus className="w-4 h-4" />
                  {!isCollapsed && <span>New Chat</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Chats Section - Hidden when collapsed */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Conversations</SidebarGroupLabel>
            
            <SidebarGroupContent>
              <ScrollArea className="h-64">
                <SidebarMenu>
                  {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id}>
                    <div className="group/menu-item relative">
                      <SidebarMenuButton
                        isActive={currentChatId === chat.id}
                        onClick={() => onChatSelect(chat.id)}
                        className="flex items-center gap-2 p-2 w-full"
                      >
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
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
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-6 w-6 p-0 opacity-0 group-hover/menu-item:opacity-100"
                          >
                            <MoreHorizontal className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background border">
                          <DropdownMenuItem>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Knowledge Base Section - Hidden when collapsed */}
        {!isCollapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Knowledge Base</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-2">
                <FileUploadZone />
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center gap-2 p-2 justify-center">
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
