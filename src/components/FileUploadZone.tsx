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
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  chunks?: number;
  embeddings?: number;
}

export const FileUploadZone = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();

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
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      };

      setUploadedFiles(prev => [...prev, uploadedFile]);

      // Simulate upload and processing
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          clearInterval(interval);
          setUploadedFiles(prev => prev.map(f => 
            f.id === uploadedFile.id 
              ? { 
                  ...f, 
                  status: "processing", 
                  progress: 100,
                  chunks: Math.floor(Math.random() * 50) + 10,
                  embeddings: Math.floor(Math.random() * 20) + 5
                }
              : f
          ));

          // Simulate processing
          setTimeout(() => {
            setUploadedFiles(prev => prev.map(f => 
              f.id === uploadedFile.id 
                ? { ...f, status: "completed" }
                : f
            ));
            toast({
              title: "File processed",
              description: `${file.name} is ready for queries`,
            });
          }, 2000);
        } else {
          setUploadedFiles(prev => prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress }
              : f
          ));
        }
      }, 200);
    });
  }, [toast]);

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

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
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
            >
              Choose Files
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
            Uploaded Files ({uploadedFiles.length})
          </h3>
        </div>
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {uploadedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <Card key={file.id} className="p-3 bg-gradient-card border-border/50">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                      <FileIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {file.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeFile(file.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </span>
                        {file.status === "completed" && (
                          <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ready
                          </Badge>
                        )}
                        {file.status === "error" && (
                          <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/20">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </div>
                      {file.status !== "completed" && file.status !== "error" && (
                        <Progress value={file.progress} className="h-1" />
                      )}
                      {file.chunks && file.embeddings && (
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {file.chunks} chunks
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {file.embeddings} embeddings
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
            {uploadedFiles.length === 0 && (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">
                  No files uploaded yet
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};