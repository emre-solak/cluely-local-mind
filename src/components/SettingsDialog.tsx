import { useState } from "react";
import { 
  Settings, 
  User,
  Bell,
  Palette,
  Globe,
  Shield,
  Database,
  Plug,
  ChevronRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploadZone } from "./FileUploadZone";
import { IntegrationsSection } from "./IntegrationsSection";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const settingsCategories = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "personalization", label: "Personalization", icon: Palette },
  { id: "language", label: "Language", icon: Globe },
  { id: "knowledge", label: "Knowledge Base", icon: Database },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "security", label: "Security", icon: Shield },
  { id: "account", label: "Account", icon: User },
];

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeCategory, setActiveCategory] = useState("general");
  const [customInstructions, setCustomInstructions] = useState(true);
  const [customInstructionsText, setCustomInstructionsText] = useState("");
  const [chatNotifications, setChatNotifications] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(false);
  const [referenceMemories, setReferenceMemories] = useState(true);
  const [referenceChatHistory, setReferenceChatHistory] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [personalityTraits, setPersonalityTraits] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const renderContent = () => {
    switch (activeCategory) {
      case "knowledge":
        return <FileUploadZone />;
      
      case "integrations":
        return <IntegrationsSection />;
      
      case "general":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">General Settings</h3>
              
              <div className="space-y-6">
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Theme</h4>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Language</h4>
                  <Select defaultValue="auto">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3">
                  <div className="space-y-1">
                    <p className="font-medium">Chat notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new messages and responses
                    </p>
                  </div>
                  <Switch 
                    checked={chatNotifications} 
                    onCheckedChange={setChatNotifications}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div className="space-y-1">
                    <p className="font-medium">System updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about new features and updates
                    </p>
                  </div>
                  <Switch 
                    checked={systemUpdates} 
                    onCheckedChange={setSystemUpdates}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "personalization":
        return (
          <div className="space-y-8 max-w-none">
            <div>
              <h3 className="text-lg font-semibold mb-4">Customize Local AI</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Introduce yourself to get better, more personalized responses
              </p>
              
              <div className="space-y-6">
                {/* Custom Instructions Section */}
                <div className="space-y-4 pb-6 border-b">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">Custom instructions</h4>
                      <p className="text-sm text-muted-foreground">
                        Customize how the AI responds to you
                      </p>
                    </div>
                    <Switch 
                      checked={customInstructions} 
                      onCheckedChange={setCustomInstructions}
                    />
                  </div>
                  
                  {customInstructions && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Custom prompt</label>
                      <Textarea 
                        placeholder="e.g., Straight To The Point, Value Provider, No BS. Take a forward-thinking view. You're not a hypeman..."
                        value={customInstructionsText}
                        onChange={(e) => setCustomInstructionsText(e.target.value)}
                        className="min-h-32 resize-none w-full max-w-full"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">What should Local AI call you?</label>
                  <Input 
                    placeholder="Enter your preferred name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="max-w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">What do you do?</label>
                  <Input 
                    placeholder="e.g., Software Developer, Student, etc."
                    className="max-w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">What traits should Local AI have?</label>
                  <Textarea 
                    placeholder="Describe the personality traits you'd like Local AI to have..."
                    value={personalityTraits}
                    onChange={(e) => setPersonalityTraits(e.target.value)}
                    className="min-h-24 resize-none w-full max-w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Anything else Local AI should know about you?</label>
                  <Textarea 
                    placeholder="Interests, values, or preferences to keep in mind"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="min-h-24 resize-none w-full max-w-full"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <Switch defaultChecked />
                  <span className="text-sm">Enable for new chats</span>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save</Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "language":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Language Settings</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interface language</label>
                  <Select defaultValue="auto">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 border-t pt-6">
                  <label className="text-sm font-medium">Spoken language</label>
                  <p className="text-sm text-muted-foreground mb-2">
                    For best results, select the language you mainly speak
                  </p>
                  <Select defaultValue="auto">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto-detect</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Security & Privacy</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between py-3">
                  <div className="space-y-1">
                    <p className="font-medium">Reference saved memories</p>
                    <p className="text-sm text-muted-foreground">
                      Let Local AI save and use memories when responding
                    </p>
                  </div>
                  <Switch 
                    checked={referenceMemories} 
                    onCheckedChange={setReferenceMemories}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div className="space-y-1">
                    <p className="font-medium">Reference chat history</p>
                    <p className="text-sm text-muted-foreground">
                      Let Local AI reference all previous conversations when responding
                    </p>
                  </div>
                  <Switch 
                    checked={referenceChatHistory} 
                    onCheckedChange={setReferenceChatHistory}
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div className="space-y-1">
                    <p className="font-medium">Manage memories</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>

                <div className="flex items-center justify-between py-3 border-t">
                  <div className="space-y-1">
                    <p className="font-medium">Two-factor authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Setup
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email address</label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value="user@example.com" 
                      readOnly 
                      className="bg-muted"
                    />
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                </div>

                <div className="space-y-2 border-t pt-6">
                  <label className="text-sm font-medium">Password</label>
                  <Button variant="outline" size="sm">
                    Change password
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-destructive">Danger Zone</h4>
                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-1">
                        <p className="font-medium">Delete account</p>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div>Select a category</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0 [&>button]:hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-muted/30 border-r flex flex-col">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="text-xl">Settings</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 px-3 py-4">
              <div className="space-y-1">
                {settingsCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "secondary" : "ghost"}
                      className="w-full justify-start h-10 px-3"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <span className="flex-1 text-left">{category.label}</span>
                      {activeCategory === category.id && (
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      )}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="p-6 border-b bg-background flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {settingsCategories.find(c => c.id === activeCategory)?.label}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">Close</span>
                  ✕
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6">
                {renderContent()}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
