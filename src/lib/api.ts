
const API_BASE_URL = 'http://localhost:3001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  last_message_at?: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tokens?: number;
  processing_time?: number;
  context?: Array<{
    filename: string;
    content: string;
    relevance: number;
  }>;
}

export interface Document {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
  processed: boolean;
  processing_error?: string;
  chunk_count?: number;
}

export interface LiveSession {
  id?: string;
  mode: 'live' | 'periodic' | 'off';
  started_at?: string;
  ended_at?: string;
  total_suggestions?: number;
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Chat endpoints
  async getChats(): Promise<Chat[]> {
    return this.request<Chat[]>('/chat');
  }

  async createChat(title?: string): Promise<Chat> {
    return this.request<Chat>('/chat', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async getChatMessages(chatId: string): Promise<Message[]> {
    return this.request<Message[]>(`/chat/${chatId}/messages`);
  }

  async sendMessage(chatId: string, content: string): Promise<{ userMessage: Message; assistantMessage: Message }> {
    return this.request(`/chat/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async deleteChat(chatId: string): Promise<{ success: boolean }> {
    return this.request(`/chat/${chatId}`, {
      method: 'DELETE',
    });
  }

  // Document endpoints
  async getDocuments(): Promise<Document[]> {
    return this.request<Document[]>('/documents');
  }

  async uploadDocument(file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('document', file);

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async deleteDocument(documentId: string): Promise<{ success: boolean }> {
    return this.request(`/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  // Live Copilot endpoints
  async setObservationMode(mode: 'live' | 'periodic' | 'off'): Promise<LiveSession> {
    return this.request<LiveSession>(`/live-copilot/mode/${mode}`, {
      method: 'POST',
    });
  }

  async getCurrentSession(): Promise<LiveSession> {
    return this.request<LiveSession>('/live-copilot/session');
  }

  async addTranscriptEntry(sessionId: string, speaker: 'user' | 'other', text: string, confidence?: number) {
    return this.request('/live-copilot/transcript', {
      method: 'POST',
      body: JSON.stringify({ sessionId, speaker, text, confidence }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; database: string }> {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
```

Now I'll create React hooks to manage the API state with React Query:

<lov-write file_path="src/hooks/useApi.ts">
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, Chat, Message, Document, LiveSession } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

// Chat hooks
export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: apiClient.getChats,
  });
};

export const useChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: ['chat-messages', chatId],
    queryFn: () => apiClient.getChatMessages(chatId),
    enabled: !!chatId,
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (title?: string) => apiClient.createChat(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      toast({
        title: 'Chat created',
        description: 'New chat conversation started',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ chatId, content }: { chatId: string; content: string }) => 
      apiClient.sendMessage(chatId, content),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error sending message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Document hooks
export const useDocuments = () => {
  return useQuery({
    queryKey: ['documents'],
    queryFn: apiClient.getDocuments,
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => apiClient.uploadDocument(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({
        title: 'Document uploaded',
        description: `${data.original_name} uploaded successfully`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Live Copilot hooks
export const useCurrentSession = () => {
  return useQuery({
    queryKey: ['live-session'],
    queryFn: apiClient.getCurrentSession,
  });
};

export const useSetObservationMode = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (mode: 'live' | 'periodic' | 'off') => apiClient.setObservationMode(mode),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['live-session'] });
      toast({
        title: 'Mode updated',
        description: `Live copilot set to ${data.mode}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Health check hook  
export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: apiClient.healthCheck,
    refetchInterval: 30000, // Check every 30 seconds
  });
};
```

Now I'll update the ChatInterface to use the real API:

<lov-write file_path="src/components/ChatInterface.tsx">
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Send, Bot, FileText, Clock, Settings2 } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ContextPanel } from "./ContextPanel";
import { AppSidebar } from "./AppSidebar";
import { ObservationModeToggle } from "./ObservationModeToggle";
import { LiveNudgeBox } from "./LiveNudgeBox";
import { TranscriptStream } from "./TranscriptStream";
import { PerformanceTipToast } from "./PerformanceTipToast";
import { DebugMetrics } from "./DebugMetrics";
import { useChats, useChatMessages, useCreateChat, useSendMessage, useHealthCheck, useSetObservationMode, useCurrentSession } from "@/hooks/useApi";
import { Message as ApiMessage } from "@/lib/api";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  context?: Array<{
    filename: string;
    content: string;
    relevance: number;
  }>;
  tokens?: number;
  processingTime?: number;
}

// Convert API message to UI message format
const convertApiMessage = (apiMessage: ApiMessage): Message => ({
  id: apiMessage.id,
  content: apiMessage.content,
  role: apiMessage.role,
  timestamp: new Date(apiMessage.timestamp),
  context: apiMessage.context,
  tokens: apiMessage.tokens,
  processingTime: apiMessage.processing_time,
});

export const ChatInterface = () => {
  const [inputValue, setInputValue] = useState("");
  const [showContext, setShowContext] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showDebugMetrics, setShowDebugMetrics] = useState(false);
  const [showLiveCopilot, setShowLiveCopilot] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: chats = [], isLoading: chatsLoading } = useChats();
  const { data: apiMessages = [], isLoading: messagesLoading } = useChatMessages(currentChatId || '');
  const createChatMutation = useCreateChat();
  const sendMessageMutation = useSendMessage();
  const { data: healthData } = useHealthCheck();
  const setObservationModeMutation = useSetObservationMode();
  const { data: currentSession } = useCurrentSession();

  // Convert API messages to UI format
  const messages = apiMessages.map(convertApiMessage);

  // Set initial chat if none selected
  useEffect(() => {
    if (!currentChatId && chats.length > 0) {
      setCurrentChatId(chats[0].id);
    }
  }, [chats, currentChatId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !currentChatId) return;

    const messageContent = inputValue;
    setInputValue("");

    try {
      await sendMessageMutation.mutateAsync({
        chatId: currentChatId,
        content: messageContent,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleNewChat = async () => {
    try {
      const newChat = await createChatMutation.mutateAsync();
      setCurrentChatId(newChat.id);
    } catch (error) {
      console.error('Failed to create chat:', error);
    }
  };

  const handleObservationModeChange = async (mode: "live" | "periodic" | "off") => {
    try {
      await setObservationModeMutation.mutateAsync(mode);
    } catch (error) {
      console.error('Failed to change observation mode:', error);
    }
  };

  const isBackendConnected = healthData?.status === 'healthy';
  const liveCopilotActive = currentSession?.mode !== 'off';

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar 
          currentChatId={currentChatId || ''}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
        />
        
        <SidebarInset className="flex-1">
          {/* Header */}
          <div className="border-b border-border bg-gradient-card p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-neural flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Local AI Assistant</h1>
                  <p className="text-sm text-muted-foreground">
                    {isBackendConnected ? 'Connected to backend • Ready to help' : 'Connecting to backend...'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={isBackendConnected ? "bg-success/10 text-success border-success/20" : "bg-destructive/10 text-destructive border-destructive/20"}>
                  {isBackendConnected ? 'Online' : 'Offline'}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowContext(!showContext)}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Context
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowLiveCopilot(!showLiveCopilot)}
                >
                  <Settings2 className="w-4 h-4 mr-2" />
                  Live Copilot
                </Button>
              </div>
            </div>
          </div>

          {/* Live Copilot Panel */}
          {showLiveCopilot && (
            <>
              <div className="border-b border-border bg-muted/30 p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <ObservationModeToggle onModeChange={handleObservationModeChange} />
                  <TranscriptStream isActive={liveCopilotActive} />
                </div>
              </div>
            </>
          )}

          {/* Messages Area */}
          <div className="flex-1 flex min-h-0">
            <div className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
                <div className="py-4 space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="text-sm text-muted-foreground">Loading messages...</div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                        <div className="flex items-center gap-2 mb-2">
                          <Bot className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-foreground">AI Assistant</span>
                        </div>
                        <p className="text-sm text-foreground">
                          Hello! I'm your local AI assistant. Upload documents and I'll help you find information, answer questions, and analyze your files. What would you like to know?
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <MessageBubble 
                        key={message.id} 
                        message={message}
                        onShowContext={() => setShowContext(true)}
                      />
                    ))
                  )}
                  {sendMessageMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 bg-muted rounded-lg px-4 py-3">
                        <Bot className="w-4 h-4 text-primary animate-glow-pulse" />
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-border bg-gradient-card p-4">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about your documents..."
                      className="pr-12 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/25"
                      disabled={sendMessageMutation.isPending || !isBackendConnected}
                    />
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || sendMessageMutation.isPending || !isBackendConnected}
                      className="absolute right-1 top-1 h-8 w-8 p-0 bg-gradient-neural hover:shadow-glow transition-all duration-200"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {isBackendConnected ? 'Ready' : 'Connecting...'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto p-1 text-xs"
                      onClick={() => setShowDebugMetrics(!showDebugMetrics)}
                    >
                      Debug
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Context Panel */}
            {showContext && (
              <>
                <Separator orientation="vertical" />
                <ContextPanel onClose={() => setShowContext(false)} />
              </>
            )}
          </div>
        </SidebarInset>

        {/* Floating UI Components */}
        <LiveNudgeBox isActive={liveCopilotActive} position="bottom-right" />
        <PerformanceTipToast isActive={liveCopilotActive} position="top-center" />
        <DebugMetrics visible={showDebugMetrics} onToggleVisibility={setShowDebugMetrics} />
      </div>
    </SidebarProvider>
  );
};
```

Now I'll update the FileUploadZone to use the real API:

<lov-write file_path="src/components/FileUploadZone.tsx">
import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Upload, 
  FileText, 
  File, 
  Image, 
  Music, 
  Video, 
  Archive,
  Trash2,
  CheckCircle,
  AlertCircle,
  Settings
} from "lucide-react";
import { useDocuments, useUploadDocument } from "@/hooks/useApi";
import { apiClient } from "@/lib/api";

export const FileUploadZone = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { data: documents = [], isLoading } = useDocuments();
  const uploadMutation = useUploadDocument();

  const getFileIcon = (type: string) => {
    if (type.includes("pdf") || type.includes("text")) return FileText;
    if (type.includes("image")) return Image;
    if (type.includes("audio")) return Music;
    if (type.includes("video")) return Video;
    if (type.includes("zip") || type.includes("rar")) return Archive;
    return File;
  };

  const handleFileUpload = useCallback((files: FileList) => {
    Array.from(files).forEach((file) => {
      uploadMutation.mutate(file);
    });
  }, [uploadMutation]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeDocument = async (id: string) => {
    try {
      await apiClient.deleteDocument(id);
      // The useDocuments hook will automatically refetch and update the UI
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Knowledge Base</h2>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload documents to enhance AI responses
        </p>
      </div>

      {/* Upload Zone */}
      <div className="p-4">
        <Card 
          className={`border-2 border-dashed transition-all duration-200 ${
            isDragOver 
              ? "border-primary bg-primary/5 shadow-glow/30" 
              : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="p-8 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-neural flex items-center justify-center">
              <Upload className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-2">
              Drop files here or click to browse
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Supports PDF, DOCX, TXT, MD, JSON, CSV
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => document.getElementById("file-input")?.click()}
              className="hover:bg-primary/10 hover:border-primary/50"
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Uploading...' : 'Choose Files'}
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              accept=".pdf,.docx,.txt,.md,.json,.csv"
            />
          </div>
        </Card>
      </div>

      {/* File List */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 pb-2">
          <h3 className="text-sm font-medium text-foreground">
            Uploaded Files ({documents.length})
          </h3>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-sm text-muted-foreground">Loading documents...</div>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No files uploaded yet
                </p>
              </div>
            ) : (
              documents.map((document) => {
                const FileIcon = getFileIcon(document.mime_type);
                return (
                  <Card key={document.id} className="p-3 bg-gradient-card border-border/50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                        <FileIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-foreground truncate">
                            {document.original_name}
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => removeDocument(document.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(document.file_size)}
                          </span>
                          {document.processed && (
                            <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ready
                            </Badge>
                          )}
                          {document.processing_error && (
                            <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Error
                            </Badge>
                          )}
                          {!document.processed && !document.processing_error && (
                            <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                              Processing...
                            </Badge>
                          )}
                        </div>
                        {document.chunk_count && (
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {document.chunk_count} chunks
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
```
