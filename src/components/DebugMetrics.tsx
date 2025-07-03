
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Clock, 
  Database, 
  Zap, 
  BarChart3, 
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";

interface SystemMetrics {
  tokenUsage: number;
  responseTime: number;
  vectorSearchTime: number;
  ollamaStatus: "online" | "offline" | "loading";
  chromaDbStatus: "connected" | "disconnected" | "error";
  activeModel: string;
  memoryUsage: number;
  requestCount: number;
}

interface DebugMetricsProps {
  visible?: boolean;
  onToggleVisibility?: (visible: boolean) => void;
}

export function DebugMetrics({ visible = false, onToggleVisibility }: DebugMetricsProps) {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    tokenUsage: 0,
    responseTime: 0,
    vectorSearchTime: 0,
    ollamaStatus: "online",
    chromaDbStatus: "connected",
    activeModel: "llama3:8b-instruct",
    memoryUsage: 45,
    requestCount: 0
  });

  const [isVisible, setIsVisible] = useState(visible);

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        tokenUsage: Math.floor(Math.random() * 500) + 100,
        responseTime: Math.random() * 2000 + 500,
        vectorSearchTime: Math.random() * 200 + 50,
        memoryUsage: Math.floor(Math.random() * 30) + 40,
        requestCount: prev.requestCount + (Math.random() > 0.7 ? 1 : 0)
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    onToggleVisibility?.(newVisibility);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "connected":
        return "bg-green-500";
      case "offline":
      case "disconnected":
        return "bg-red-500";
      case "loading":
      case "error":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
      case "connected":
        return "text-green-600";
      case "offline":
      case "disconnected":
        return "text-red-600";
      case "loading":
      case "error":
        return "text-orange-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleVisibility}
        className="mb-2 bg-background/80 backdrop-blur-sm"
      >
        {isVisible ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
        Debug Metrics
      </Button>

      {/* Metrics Panel */}
      {isVisible && (
        <Card className="w-80 shadow-lg border bg-background/95 backdrop-blur-sm animate-fade-in">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                System Performance
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => {
                  // Simulate refresh metrics
                  setMetrics(prev => ({ ...prev, requestCount: prev.requestCount + 1 }));
                }}
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Service Status */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(metrics.ollamaStatus)}`} />
                  <span className="text-xs font-medium">Ollama</span>
                </div>
                <Badge variant="outline" className={`text-xs ${getStatusText(metrics.ollamaStatus)}`}>
                  {metrics.ollamaStatus}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(metrics.chromaDbStatus)}`} />
                  <span className="text-xs font-medium">ChromaDB</span>
                </div>
                <Badge variant="outline" className={`text-xs ${getStatusText(metrics.chromaDbStatus)}`}>
                  {metrics.chromaDbStatus}
                </Badge>
              </div>
            </div>

            {/* Active Model */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3" />
                <span className="text-xs font-medium">Active Model</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {metrics.activeModel}
              </Badge>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">Response Time</span>
                  </div>
                  <span className="text-xs font-mono">
                    {metrics.responseTime.toFixed(0)}ms
                  </span>
                </div>
                <Progress 
                  value={Math.min((metrics.responseTime / 3000) * 100, 100)} 
                  className="h-1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-3 h-3" />
                    <span className="text-xs">Vector Search</span>
                  </div>
                  <span className="text-xs font-mono">
                    {metrics.vectorSearchTime.toFixed(0)}ms
                  </span>
                </div>
                <Progress 
                  value={Math.min((metrics.vectorSearchTime / 500) * 100, 100)} 
                  className="h-1"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" />
                    <span className="text-xs">Memory Usage</span>
                  </div>
                  <span className="text-xs font-mono">
                    {metrics.memoryUsage}%
                  </span>
                </div>
                <Progress value={metrics.memoryUsage} className="h-1" />
              </div>
            </div>

            {/* Token & Request Stats */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {metrics.tokenUsage}
                </div>
                <div className="text-xs text-muted-foreground">
                  Tokens Used
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-primary">
                  {metrics.requestCount}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total Requests
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
