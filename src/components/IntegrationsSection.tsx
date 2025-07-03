
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { integrationsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export function IntegrationsSection() {
  const { toast } = useToast();
  
  // Ollama state
  const [ollamaEnabled, setOllamaEnabled] = useState(false);
  const [ollamaUrl, setOllamaUrl] = useState("http://localhost:11434");
  const [ollamaStatus, setOllamaStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [ollamaModels, setOllamaModels] = useState<any[]>([]);
  
  // ChromaDB state
  const [chromaEnabled, setChromaEnabled] = useState(false);
  const [chromaUrl, setChromaUrl] = useState("http://localhost:8000");
  const [chromaStatus, setChromaStatus] = useState<'idle' | 'testing' | 'connected' | 'error'>('idle');
  const [chromaCollections, setChromaCollections] = useState<any[]>([]);

  const testOllamaConnection = async () => {
    setOllamaStatus('testing');
    try {
      const isConnected = await integrationsApi.testOllamaConnection(ollamaUrl);
      if (isConnected) {
        const models = await integrationsApi.getOllamaModels(ollamaUrl);
        setOllamaModels(models.models || []);
        setOllamaStatus('connected');
        toast({
          title: "Ollama Connected",
          description: `Found ${models.models?.length || 0} models`,
        });
      } else {
        setOllamaStatus('error');
        toast({
          title: "Connection Failed",
          description: "Could not connect to Ollama. Make sure it's running.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setOllamaStatus('error');
      toast({
        title: "Connection Error",
        description: "Failed to test Ollama connection",
        variant: "destructive",
      });
    }
  };

  const testChromaConnection = async () => {
    setChromaStatus('testing');
    try {
      const isConnected = await integrationsApi.testChromaConnection(chromaUrl);
      if (isConnected) {
        const collections = await integrationsApi.getChromaCollections(chromaUrl);
        setChromaCollections(collections || []);
        setChromaStatus('connected');
        toast({
          title: "ChromaDB Connected",
          description: `Found ${collections?.length || 0} collections`,
        });
      } else {
        setChromaStatus('error');
        toast({
          title: "Connection Failed",
          description: "Could not connect to ChromaDB. Make sure it's running.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setChromaStatus('error');
      toast({
        title: "Connection Error",
        description: "Failed to test ChromaDB connection",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'testing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Integrations</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Connect external services to enhance your AI assistant capabilities
        </p>

        <div className="space-y-8">
          {/* Ollama Integration */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">O</span>
                </div>
                <div>
                  <h4 className="font-medium">Ollama</h4>
                  <p className="text-sm text-muted-foreground">Local LLM runtime</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(ollamaStatus)}
                <Switch
                  checked={ollamaEnabled}
                  onCheckedChange={setOllamaEnabled}
                />
              </div>
            </div>

            {ollamaEnabled && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ollama URL"
                    value={ollamaUrl}
                    onChange={(e) => setOllamaUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={testOllamaConnection}
                    disabled={ollamaStatus === 'testing'}
                    variant="outline"
                  >
                    {ollamaStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>

                {ollamaStatus === 'connected' && ollamaModels.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Available Models:</p>
                    <div className="flex flex-wrap gap-2">
                      {ollamaModels.map((model) => (
                        <Badge key={model.name} variant="secondary">
                          {model.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Alert>
                  <AlertDescription>
                    Make sure Ollama is running locally. Visit{' '}
                    <a 
                      href="https://ollama.ai" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      ollama.ai <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    for installation instructions.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          {/* ChromaDB Integration */}
          <div className="border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-semibold text-sm">C</span>
                </div>
                <div>
                  <h4 className="font-medium">ChromaDB</h4>
                  <p className="text-sm text-muted-foreground">Vector database for embeddings</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(chromaStatus)}
                <Switch
                  checked={chromaEnabled}
                  onCheckedChange={setChromaEnabled}
                />
              </div>
            </div>

            {chromaEnabled && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="ChromaDB URL"
                    value={chromaUrl}
                    onChange={(e) => setChromaUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={testChromaConnection}
                    disabled={chromaStatus === 'testing'}
                    variant="outline"
                  >
                    {chromaStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>

                {chromaStatus === 'connected' && chromaCollections.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Collections:</p>
                    <div className="flex flex-wrap gap-2">
                      {chromaCollections.map((collection) => (
                        <Badge key={collection.name} variant="secondary">
                          {collection.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Alert>
                  <AlertDescription>
                    ChromaDB should be running locally. Visit{' '}
                    <a 
                      href="https://docs.trychroma.com/getting-started" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline inline-flex items-center gap-1"
                    >
                      ChromaDB docs <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    for setup instructions.
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline">Cancel</Button>
            <Button>Save Integrations</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
