import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, User, Sparkles, FileText, Clock } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { FileUploadZone } from "./FileUploadZone";
import { ContextPanel } from "./ContextPanel";

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

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your local AI assistant. Upload documents and I'll help you find information, answer questions, and analyze your files. What would you like to know?",
      role: "assistant",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate API call to local LLM
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${inputValue}". Once you connect this to your local Ollama instance, I'll be able to process your query using your selected model and retrieve relevant context from your uploaded documents.`,
        role: "assistant",
        timestamp: new Date(),
        context: [
          {
            filename: "example-doc.pdf",
            content: "Sample context from your documents will appear here...",
            relevance: 0.85
          }
        ],
        tokens: 245,
        processingTime: 1.2
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-gradient-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-neural flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Local AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Connected to local LLM • Ready to help</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                <Sparkles className="w-3 h-3 mr-1" />
                Online
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowContext(!showContext)}
              >
                <FileText className="w-4 h-4 mr-2" />
                Context
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
              <div className="py-4 space-y-4">
                {messages.map((message) => (
                  <MessageBubble 
                    key={message.id} 
                    message={message}
                    onShowContext={() => setShowContext(true)}
                  />
                ))}
                {isLoading && (
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
                    disabled={isLoading}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
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
                    Ready
                  </span>
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
      </div>

      {/* File Upload Sidebar */}
      <Separator orientation="vertical" />
      <div className="w-80 bg-gradient-card">
        <FileUploadZone />
      </div>
    </div>
  );
};