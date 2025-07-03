import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { X, FileText, TrendingUp, Eye } from "lucide-react";

interface ContextPanelProps {
  onClose: () => void;
}

export const ContextPanel = ({ onClose }: ContextPanelProps) => {
  // Mock context data - in real app this would come from vector search
  const contextSources = [
    {
      filename: "meeting-notes-2024.pdf",
      content: "The quarterly planning meeting discussed key priorities for Q1 including product development roadmap, hiring plans, and budget allocation. Key decisions made include...",
      relevance: 0.92,
      page: 3,
      section: "Q1 Planning"
    },
    {
      filename: "project-requirements.docx",
      content: "User authentication requirements specify that the system must support OAuth 2.0, multi-factor authentication, and session management with configurable timeout periods...",
      relevance: 0.87,
      page: 12,
      section: "Authentication"
    },
    {
      filename: "market-analysis.txt",
      content: "Market research indicates strong demand for local AI solutions, particularly among privacy-conscious enterprise customers. Key findings show 73% preference for on-premise deployment...",
      relevance: 0.81,
      page: null,
      section: "Findings"
    }
  ];

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.9) return "bg-success/10 text-success border-success/20";
    if (relevance >= 0.8) return "bg-warning/10 text-warning border-warning/20";
    return "bg-muted/10 text-muted-foreground border-muted/20";
  };

  return (
    <div className="w-96 bg-gradient-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Context Sources</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Retrieved context for current conversation
        </p>
      </div>

      {/* Context List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {contextSources.map((source, index) => (
            <Card key={index} className="p-4 bg-background/50 border-border/50 hover:bg-background/80 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground truncate">
                    {source.filename}
                  </span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getRelevanceColor(source.relevance)}`}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {Math.round(source.relevance * 100)}%
                </Badge>
              </div>

              <div className="mb-3">
                <p className="text-sm text-foreground leading-relaxed">
                  {source.content}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {source.page && (
                    <span>Page {source.page}</span>
                  )}
                  {source.section && (
                    <>
                      {source.page && <span>•</span>}
                      <span>{source.section}</span>
                    </>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            </Card>
          ))}

          {contextSources.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No context sources for this conversation
              </p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="flex items-center justify-between mb-1">
            <span>Total sources:</span>
            <span className="font-medium">{contextSources.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Avg relevance:</span>
            <span className="font-medium">
              {Math.round((contextSources.reduce((acc, s) => acc + s.relevance, 0) / contextSources.length) * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};