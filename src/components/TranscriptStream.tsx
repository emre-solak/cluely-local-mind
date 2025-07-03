
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, VolumeX, Eye, EyeOff } from "lucide-react";

interface TranscriptEntry {
  id: string;
  timestamp: Date;
  speaker: "user" | "other";
  text: string;
  confidence?: number;
}

interface TranscriptStreamProps {
  isActive?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
}

export function TranscriptStream({ isActive = false, onToggleVisibility }: TranscriptStreamProps) {
  const [transcriptEntries, setTranscriptEntries] = useState<TranscriptEntry[]>([]);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Simulate real-time transcript entries (replace with actual Whisper integration)
  const samplePhrases = [
    { speaker: "user" as const, text: "So what are your main concerns about implementing this solution?" },
    { speaker: "other" as const, text: "Well, the main issue is budget. We're looking at a tight timeline." },
    { speaker: "user" as const, text: "I understand. Let me show you how this could actually save costs long-term." },
    { speaker: "other" as const, text: "That would be helpful. We need to justify the ROI to leadership." },
    { speaker: "user" as const, text: "Absolutely. Based on what you've shared, I can see three key areas..." },
  ];

  useEffect(() => {
    if (!isActive) return;

    let phraseIndex = 0;
    const interval = setInterval(() => {
      if (phraseIndex < samplePhrases.length) {
        const newEntry: TranscriptEntry = {
          id: Date.now().toString(),
          timestamp: new Date(),
          speaker: samplePhrases[phraseIndex].speaker,
          text: samplePhrases[phraseIndex].text,
          confidence: Math.random() * 0.2 + 0.8 // 80-100% confidence
        };
        
        setTranscriptEntries(prev => [...prev.slice(-9), newEntry]); // Keep last 10 entries
        phraseIndex = (phraseIndex + 1) % samplePhrases.length;
      }
    }, 8000); // New transcript every 8 seconds

    return () => clearInterval(interval);
  }, [isActive]);

  // Auto-scroll to bottom when new entries are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [transcriptEntries]);

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    onToggleVisibility?.(newVisibility);
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <div className="flex items-center gap-1">
              {isActive ? (
                <Mic className="w-4 h-4 text-green-500 animate-pulse" />
              ) : (
                <MicOff className="w-4 h-4 text-muted-foreground" />
              )}
              Live Transcript
            </div>
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleToggleVisibility}
            >
              {isVisible ? (
                <EyeOff className="w-3 h-3" />
              ) : (
                <Eye className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isVisible && (
        <CardContent className="pt-0">
          <ScrollArea className="h-64 w-full" ref={scrollAreaRef}>
            <div className="space-y-3">
              {transcriptEntries.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  {isActive ? "Listening for speech..." : "Start live mode to see transcript"}
                </div>
              ) : (
                transcriptEntries.map((entry) => (
                  <div key={entry.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={entry.speaker === "user" ? "default" : "secondary"}
                          className="text-xs px-2"
                        >
                          {entry.speaker === "user" ? "You" : "Other"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(entry.timestamp)}
                        </span>
                      </div>
                      {entry.confidence && (
                        <span className="text-xs text-muted-foreground">
                          {Math.round(entry.confidence * 100)}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed pl-2 border-l-2 border-muted">
                      {entry.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
          
          {isActive && (
            <div className="mt-3 pt-3 border-t">
              <div className="text-xs text-muted-foreground">
                💡 Tip: AI suggestions appear based on conversation context
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
