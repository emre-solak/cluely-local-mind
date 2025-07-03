
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mic, Clock, X, RefreshCw } from "lucide-react";

interface LiveNudgeBoxProps {
  isActive?: boolean;
  position?: "bottom-right" | "top-left" | "top-right" | "bottom-left";
}

export function LiveNudgeBox({ isActive = false, position = "bottom-right" }: LiveNudgeBoxProps) {
  const [currentSuggestion, setCurrentSuggestion] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState<number>(30);
  const [isVisible, setIsVisible] = useState<boolean>(true);

  // Simulate AI suggestions (replace with actual API call)
  const suggestions = [
    "Try asking about their current pain points",
    "Reframe pricing as long-term value investment",
    "Ask about their decision-making timeline",
    "Probe deeper into their budget constraints",
    "Suggest a pilot program to reduce risk",
    "Ask who else is involved in the decision"
  ];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate receiving new AI feedback
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      setCurrentSuggestion(randomSuggestion);
      setLastUpdated(new Date());
      setCountdown(30);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, countdown]);

  // Initialize with first suggestion
  useEffect(() => {
    if (isActive && !currentSuggestion) {
      setCurrentSuggestion(suggestions[0]);
    }
  }, [isActive]);

  const getPositionClasses = () => {
    switch (position) {
      case "top-left":
        return "top-4 left-4";
      case "top-right":
        return "top-4 right-4";
      case "bottom-left":
        return "bottom-4 left-4";
      case "bottom-right":
      default:
        return "bottom-4 right-4";
    }
  };

  if (!isActive || !isVisible) {
    return null;
  }

  return (
    <Card className={`fixed ${getPositionClasses()} w-72 shadow-lg border-2 border-primary/20 z-50 animate-fade-in`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Mic className="w-3 h-3 text-green-500 animate-pulse" />
              <Badge variant="secondary" className="text-xs px-1">
                Live
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{countdown}s</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="text-sm font-medium text-primary">
            💡 AI Suggestion
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            {currentSuggestion}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-3 pt-2 border-t">
          <span className="text-xs text-muted-foreground">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => {
              const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
              setCurrentSuggestion(randomSuggestion);
              setLastUpdated(new Date());
              setCountdown(30);
            }}
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
