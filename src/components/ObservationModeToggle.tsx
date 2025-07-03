
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Clock, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ObservationMode = "live" | "periodic" | "off";

interface ObservationModeToggleProps {
  onModeChange?: (mode: ObservationMode) => void;
}

export function ObservationModeToggle({ onModeChange }: ObservationModeToggleProps) {
  const [currentMode, setCurrentMode] = useState<ObservationMode>("off");
  const { toast } = useToast();

  const handleModeChange = async (mode: ObservationMode) => {
    try {
      // Future: Call API endpoint `/api/set-mode/${mode}`
      console.log(`Setting observation mode to: ${mode}`);
      
      setCurrentMode(mode);
      onModeChange?.(mode);
      
      toast({
        title: "Mode Updated",
        description: `Live copilot switched to ${mode} mode`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update observation mode",
        variant: "destructive"
      });
    }
  };

  const getModeConfig = (mode: ObservationMode) => {
    switch (mode) {
      case "live":
        return {
          label: "Live",
          icon: Mic,
          description: "Real-time monitoring",
          variant: "default" as const,
          className: "bg-red-500 hover:bg-red-600"
        };
      case "periodic":
        return {
          label: "Periodic",
          icon: Clock,
          description: "Every 15 seconds",
          variant: "secondary" as const,
          className: "bg-orange-500 hover:bg-orange-600"
        };
      case "off":
        return {
          label: "Off",
          icon: MicOff,
          description: "Privacy mode",
          variant: "outline" as const,
          className: "bg-gray-500 hover:bg-gray-600"
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium">Live Sales Copilot</h3>
        <Badge variant={currentMode === "off" ? "secondary" : "default"}>
          {currentMode === "off" ? "Inactive" : "Active"}
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {(["live", "periodic", "off"] as ObservationMode[]).map((mode) => {
          const config = getModeConfig(mode);
          const Icon = config.icon;
          const isActive = currentMode === mode;
          
          return (
            <Button
              key={mode}
              onClick={() => handleModeChange(mode)}
              variant={isActive ? "default" : "outline"}
              className={`flex flex-col h-auto p-3 ${isActive ? config.className : ""}`}
              size="sm"
            >
              <Icon className="w-4 h-4 mb-1" />
              <span className="text-xs font-medium">{config.label}</span>
              <span className="text-xs opacity-75">{config.description}</span>
            </Button>
          );
        })}
      </div>
      
      {currentMode !== "off" && (
        <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
          <strong>Note:</strong> {currentMode === "live" 
            ? "Continuous microphone and screen monitoring active. Real-time AI suggestions enabled."
            : "Periodic screenshots every 15 seconds with AI analysis for call optimization."
          }
        </div>
      )}
    </div>
  );
}
