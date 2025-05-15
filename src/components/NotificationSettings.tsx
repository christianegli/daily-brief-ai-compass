
import { useState } from "react";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "email",
      name: "Email Notifications",
      description: "Receive notifications for new emails",
      enabled: true,
    },
    {
      id: "slack",
      name: "Slack Notifications",
      description: "Receive notifications for new Slack messages",
      enabled: true,
    },
    {
      id: "meetings",
      name: "Meeting Reminders",
      description: "Get reminders 15 minutes before meetings",
      enabled: true,
    },
    {
      id: "priority",
      name: "Priority Alerts",
      description: "Urgent notifications for high-priority items",
      enabled: false,
    },
  ]);
  
  const toggleNotification = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled } 
        : setting
    ));
    
    const setting = settings.find(s => s.id === id);
    if (setting) {
      toast.success(`${setting.name} ${!setting.enabled ? 'enabled' : 'disabled'}`);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Bell className="h-5 w-5 mr-2" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div>
                <Label htmlFor={`notification-${setting.id}`} className="font-medium">
                  {setting.name}
                </Label>
                <p className="text-sm text-slate-500">{setting.description}</p>
              </div>
              <Switch 
                id={`notification-${setting.id}`}
                checked={setting.enabled}
                onCheckedChange={() => toggleNotification(setting.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
