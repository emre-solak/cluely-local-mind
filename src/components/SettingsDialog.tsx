
import { useState } from "react";
import { 
  Settings, 
  User,
  Bell,
  Palette,
  Globe,
  Shield,
  Database,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUploadZone } from "./FileUploadZone";

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
  { id: "security", label: "Security", icon: Shield },
  { id: "account", label: "Account", icon: User },
];

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeCategory, setActiveCategory] = useState("general");

  const renderContent = () => {
    switch (activeCategory) {
      case "knowledge":
        return <FileUploadZone />;
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Theme</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose your preferred theme
              </p>
              <div className="flex gap-2">
                <Button variant="outline">System</Button>
                <Button variant="outline">Light</Button>
                <Button variant="outline">Dark</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Language</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Select your preferred language
              </p>
              <Button variant="outline">Auto-detect</Button>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Chat notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified about new messages</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System updates</p>
                    <p className="text-sm text-muted-foreground">Receive updates about new features</p>
                  </div>
                  <Button variant="outline" size="sm">Enable</Button>
                </div>
              </div>
            </div>
          </div>
        );
      case "personalization":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Personalization</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Display name</p>
                  <Button variant="outline">Set display name</Button>
                </div>
                <div>
                  <p className="font-medium mb-2">Avatar</p>
                  <Button variant="outline">Upload avatar</Button>
                </div>
              </div>
            </div>
          </div>
        );
      case "language":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Language Settings</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Interface language</p>
                  <Button variant="outline">Auto-detect</Button>
                </div>
                <div>
                  <p className="font-medium mb-2">Spoken language</p>
                  <p className="text-sm text-muted-foreground mb-2">
                    For best results, select the language you mainly speak
                  </p>
                  <Button variant="outline">Auto-detect</Button>
                </div>
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Security & Privacy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-factor authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm">Setup</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Data encryption</p>
                    <p className="text-sm text-muted-foreground">Encrypt your chat data</p>
                  </div>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
              </div>
            </div>
          </div>
        );
      case "account":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">Email</p>
                  <Button variant="outline">Update email</Button>
                </div>
                <div>
                  <p className="font-medium mb-2">Password</p>
                  <Button variant="outline">Change password</Button>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="destructive">Delete account</Button>
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
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 bg-muted/30 border-r">
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
                      className="w-full justify-start h-10"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {settingsCategories.find(c => c.id === activeCategory)?.label}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <ScrollArea className="flex-1 p-6">
              {renderContent()}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
