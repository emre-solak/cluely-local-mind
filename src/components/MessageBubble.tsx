import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, User, FileText, Clock, Zap } from "lucide-react";
import { Message } from "./ChatInterface";

interface MessageBubbleProps {
  message: Message;
  onShowContext: () => void;
}

export const MessageBubble = ({ message, onShowContext }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}>
      <div className={`flex gap-3 max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser 
            ? "bg-gradient-to-br from-accent to-accent/80" 
            : "bg-gradient-neural animate-glow-pulse"
        }`}>
          {isUser ? (
            <User className="w-4 h-4 text-accent-foreground" />
          ) : (
            <Bot className="w-4 h-4 text-primary-foreground" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
          <Card className={`p-4 shadow-card-ai transition-all duration-200 hover:shadow-glow/20 ${
            isUser 
              ? "bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20" 
              : "bg-gradient-card border-border/50"
          }`}>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-foreground leading-relaxed m-0">{message.content}</p>
            </div>
          </Card>

          {/* Message Metadata */}
          <div className={`flex items-center gap-2 text-xs text-muted-foreground ${
            isUser ? "flex-row-reverse" : ""
          }`}>
            <span>{message.timestamp.toLocaleTimeString()}</span>
            
            {message.tokens && (
              <Badge variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                {message.tokens} tokens
              </Badge>
            )}
            
            {message.processingTime && (
              <Badge variant="outline" className="text-xs">
                <Clock className="w-3 h-3 mr-1" />
                {message.processingTime}s
              </Badge>
            )}
            
            {message.context && message.context.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 text-xs hover:bg-primary/10 hover:text-primary"
                onClick={onShowContext}
              >
                <FileText className="w-3 h-3 mr-1" />
                {message.context.length} sources
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};