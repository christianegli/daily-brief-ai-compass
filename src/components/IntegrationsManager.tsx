
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IntegrationService, integrationService } from "@/lib/integrationService";
import { supabase } from "@/integrations/supabase/client";

const IntegrationsManager = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [slackConnected, setSlackConnected] = useState(false);
  const [openaiConnected, setOpenaiConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        setUserId(session.user.id);
        checkIntegrationStatus(session.user.id);
      }
    };

    checkSession();
  }, []);

  const checkIntegrationStatus = async (userId: string) => {
    try {
      setLoading(true);
      const googleStatus = await integrationService.isIntegrationConnected(userId, 'google');
      const slackStatus = await integrationService.isIntegrationConnected(userId, 'slack');
      const openaiStatus = await integrationService.isIntegrationConnected(userId, 'openai');
      
      setGoogleConnected(googleStatus);
      setSlackConnected(slackStatus);
      setOpenaiConnected(openaiStatus);
    } catch (error) {
      console.error("Error checking integration status:", error);
      toast({
        title: "Connection Error",
        description: "Failed to check integration status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const connectGoogle = async () => {
    if (!userId) return;
    try {
      const authUrl = await integrationService.getGoogleAuthUrl(userId);
      if (authUrl) {
        // Open popup window for OAuth
        const popup = window.open(authUrl, "googleAuth", "width=600,height=700");
        
        // Listen for message from popup
        window.addEventListener("message", async (event) => {
          if (event.data?.type === "GOOGLE_AUTH_SUCCESS") {
            popup?.close();
            toast({
              title: "Google Connected",
              description: "Successfully connected Google services",
            });
            checkIntegrationStatus(userId);
          }
        }, { once: true });
      }
    } catch (error) {
      console.error("Error connecting to Google:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Google",
        variant: "destructive",
      });
    }
  };

  const connectSlack = async () => {
    if (!userId) return;
    try {
      const authUrl = await integrationService.getSlackAuthUrl(userId);
      if (authUrl) {
        // Open popup window for OAuth
        const popup = window.open(authUrl, "slackAuth", "width=600,height=700");
        
        // Listen for message from popup
        window.addEventListener("message", async (event) => {
          if (event.data?.type === "SLACK_AUTH_SUCCESS") {
            popup?.close();
            toast({
              title: "Slack Connected",
              description: "Successfully connected Slack workspace",
            });
            checkIntegrationStatus(userId);
          }
        }, { once: true });
      }
    } catch (error) {
      console.error("Error connecting to Slack:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to Slack",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Service Integrations</CardTitle>
        <CardDescription>
          Connect your accounts to sync data and messages
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="google" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="slack">Slack</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="google" className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Mail className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h3 className="font-medium">Gmail & Google Calendar</h3>
                  <p className="text-sm text-gray-500">
                    {googleConnected 
                      ? "Connected and syncing" 
                      : "Not connected"}
                  </p>
                </div>
              </div>
              
              <Button
                variant={googleConnected ? "outline" : "default"}
                onClick={connectGoogle}
                disabled={loading}
              >
                {googleConnected ? "Reconnect" : "Connect"}
              </Button>
            </div>
            
            {googleConnected && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  Your Google account is connected. Email and calendar data will be synchronized.
                </p>
              </div>
            )}
            
            {!googleConnected && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <p className="text-amber-700 text-sm">
                  Connect your Google account to enable email summaries and calendar integration
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="slack" className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-full">
                  <MessageSquare className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="font-medium">Slack Workspace</h3>
                  <p className="text-sm text-gray-500">
                    {slackConnected 
                      ? "Connected and syncing" 
                      : "Not connected"}
                  </p>
                </div>
              </div>
              
              <Button
                variant={slackConnected ? "outline" : "default"}
                onClick={connectSlack}
                disabled={loading}
              >
                {slackConnected ? "Reconnect" : "Connect"}
              </Button>
            </div>
            
            {slackConnected && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  Your Slack workspace is connected. Messages will be synchronized.
                </p>
              </div>
            )}
            
            {!slackConnected && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                <p className="text-amber-700 text-sm">
                  Connect your Slack workspace to enable message summaries and notifications
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="openai" className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-medium">OpenAI Integration</h3>
                  <p className="text-sm text-gray-500">
                    {openaiConnected 
                      ? "API key configured" 
                      : "API key required"}
                  </p>
                </div>
              </div>
              
              <Button
                variant={openaiConnected ? "outline" : "default"}
                disabled
              >
                {openaiConnected ? "Update Key" : "Add API Key"}
              </Button>
            </div>
            
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-700 text-sm">
                OpenAI integration is managed by the administrator. Contact them to update the API key.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegrationsManager;
