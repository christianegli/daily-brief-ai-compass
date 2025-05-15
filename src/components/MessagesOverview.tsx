
import { useState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: number;
  platform: "slack" | "gmail" | "whatsapp";
  sender: string;
  content: string;
  time: string;
  unread: boolean;
  isUrgent?: boolean;
}

interface MessagesOverviewProps {
  compact?: boolean;
}

const MessagesOverview = ({ compact = false }: MessagesOverviewProps) => {
  const [activeTab, setActiveTab] = useState("all");

  // Mock messages data
  const messages: Message[] = [
    {
      id: 1,
      platform: "slack",
      sender: "Sarah Johnson",
      content: "Can you review the presentation before tomorrow's meeting?",
      time: "10 min ago",
      unread: true,
      isUrgent: true,
    },
    {
      id: 2,
      platform: "gmail",
      sender: "Michael Thompson",
      content: "Re: Project proposal - I've attached the updated numbers for review",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      platform: "whatsapp",
      sender: "Team Group",
      content: "Meeting location changed to Conference Room B",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: 4,
      platform: "slack",
      sender: "Dev Team",
      content: "The new feature has been deployed to production",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 5,
      platform: "gmail",
      sender: "Client Support",
      content: "Follow-up on yesterday's discussion about the timeline",
      time: "Yesterday",
      unread: false,
      isUrgent: true,
    },
    {
      id: 6,
      platform: "whatsapp",
      sender: "Alice",
      content: "Are we still on for lunch next week?",
      time: "2 days ago",
      unread: false,
    },
  ];

  const filteredMessages = messages.filter(message => {
    if (activeTab === "all") return true;
    return message.platform === activeTab;
  });

  const displayMessages = compact ? filteredMessages.slice(0, 3) : filteredMessages;

  const unreadCount = {
    all: messages.filter(m => m.unread).length,
    slack: messages.filter(m => m.platform === "slack" && m.unread).length,
    gmail: messages.filter(m => m.platform === "gmail" && m.unread).length,
    whatsapp: messages.filter(m => m.platform === "whatsapp" && m.unread).length,
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "slack":
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case "gmail":
        return <Mail className="h-5 w-5 text-red-500" />;
      case "whatsapp":
        return <Phone className="h-5 w-5 text-green-500" />;
      default:
        return <MessageCircle className="h-5 w-5" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Unread Messages</CardTitle>
          <CardDescription>
            {unreadCount.all} messages awaiting your response
          </CardDescription>
        </div>
        {compact && (
          <Button variant="outline" size="sm">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="all" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="relative">
              All
              {unreadCount.all > 0 && (
                <Badge className="ml-2 bg-indigo-500">{unreadCount.all}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="slack" className="relative">
              Slack
              {unreadCount.slack > 0 && (
                <Badge className="ml-2 bg-purple-500">{unreadCount.slack}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="gmail" className="relative">
              Gmail
              {unreadCount.gmail > 0 && (
                <Badge className="ml-2 bg-red-500">{unreadCount.gmail}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="relative">
              WhatsApp
              {unreadCount.whatsapp > 0 && (
                <Badge className="ml-2 bg-green-500">{unreadCount.whatsapp}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            <div className="space-y-3">
              {displayMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-3 rounded-lg border flex items-start hover:shadow-sm transition-shadow cursor-pointer ${
                    message.unread ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-${
                    message.platform === 'slack' ? 'purple' : 
                    message.platform === 'gmail' ? 'red' : 'green'
                  }-100`}>
                    {getPlatformIcon(message.platform)}
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{message.sender}</h4>
                      <div className="flex items-center">
                        {message.isUrgent && (
                          <Badge variant="destructive" className="mr-2">Urgent</Badge>
                        )}
                        <span className="text-xs text-slate-500">{message.time}</span>
                      </div>
                    </div>
                    <p className={`text-sm ${message.unread ? 'text-slate-800' : 'text-slate-500'}`}>
                      {message.content}
                    </p>
                  </div>
                  
                  {message.unread && (
                    <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              ))}
            </div>
            
            {!compact && filteredMessages.length > 0 && (
              <div className="mt-4 flex justify-center">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MessagesOverview;
