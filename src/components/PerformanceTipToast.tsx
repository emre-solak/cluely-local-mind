
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, Target, MessageCircle, Clock } from "lucide-react";

interface PerformanceTip {
  id: string;
  type: "objection" | "opportunity" | "timing" | "rapport";
  title: string;
  message: string;
  urgency: "low" | "medium" | "high";
  timestamp: Date;
}

interface PerformanceTipToastProps {
  isActive?: boolean;
  position?: "top-center" | "bottom-center" | "top-right";
}

export function PerformanceTipToast({ isActive = false, position = "top-center" }: PerformanceTipToastProps) {
  const [currentTip, setCurrentTip] = useState<PerformanceTip | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // Sample performance tips (replace with actual AI-generated tips)
  const sampleTips: PerformanceTip[] = [
    {
      id: "1",
      type: "objection",
      title: "Price Objection Detected",
      message: "Try reframing pricing as long-term value investment. Emphasize ROI over upfront cost.",
      urgency: "high",
      timestamp: new Date()
    },
    {
      id: "2", 
      type: "opportunity",
      title: "Discovery Opportunity",
      message: "They mentioned 'manual processes' - dig deeper into pain points and time savings.",
      urgency: "medium",
      timestamp: new Date()
    },
    {
      id: "3",
      type: "timing",
      title: "Closing Signal",
      message: "They're asking about implementation timeline. Consider moving toward next steps.",
      urgency: "high",
      timestamp: new Date()
    },
    {
      id: "4",
      type: "rapport",
      title: "Build Connection",
      message: "You both mentioned remote work challenges. Share a relevant case study.",
      urgency: "low",
      timestamp: new Date()
    }
  ];

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      return;
    }

    // Simulate AI detecting opportunities during conversation
    const interval = setInterval(() => {
      const randomTip = sampleTips[Math.floor(Math.random() * sampleTips.length)];
      setCurrentTip({ ...randomTip, timestamp: new Date() });
      setIsVisible(true);
      
      // Auto-hide after 8 seconds if low urgency, 12 seconds if medium/high
      const hideDelay = randomTip.urgency === "low" ? 8000 : 12000;
      setTimeout(() => {
        setIsVisible(false);
      }, hideDelay);
    }, 25000); // Show new tip every 25 seconds

    return () => clearInterval(interval);
  }, [isActive]);

  const getTipIcon = (type: PerformanceTip["type"]) => {
    switch (type) {
      case "objection":
        return Target;
      case "opportunity":
        return TrendingUp;
      case "timing":
        return Clock;
      case "rapport":
        return MessageCircle;
      default:
        return TrendingUp;
    }
  };

  const getUrgencyColor = (urgency: PerformanceTip["urgency"]) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 border-red-200 text-red-800";
      case "medium":
        return "bg-orange-100 border-orange-200 text-orange-800";
      case "low":
        return "bg-blue-100 border-blue-200 text-blue-800";
      default:
        return "bg-gray-100 border-gray-200 text-gray-800";
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case "top-center":
        return "top-4 left-1/2 transform -translate-x-1/2";
      case "bottom-center":
        return "bottom-4 left-1/2 transform -translate-x-1/2";
      case "top-right":
        return "top-4 right-4";
      default:
        return "top-4 left-1/2 transform -translate-x-1/2";
    }
  };

  if (!currentTip || !isVisible || !isActive) {
    return null;
  }

  const Icon = getTipIcon(currentTip.type);

  return (
    <Card className={`fixed ${getPositionClasses()} w-80 shadow-lg border-2 z-50 animate-fade-in ${getUrgencyColor(currentTip.urgency)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 rounded-full bg-white/50">
              <Icon className="w-4 h-4" />
            </div>
            
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{currentTip.title}</h4>
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 ${
                    currentTip.urgency === "high" ? "bg-red-200 text-red-800" :
                    currentTip.urgency === "medium" ? "bg-orange-200 text-orange-800" :
                    "bg-blue-200 text-blue-800"
                  }`}
                >
                  {currentTip.urgency}
                </Badge>
              </div>
              
              <p className="text-sm leading-relaxed">
                {currentTip.message}
              </p>
              
              <div className="text-xs opacity-75">
                Detected {currentTip.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/30"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
