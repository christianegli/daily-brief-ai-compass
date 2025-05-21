
import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/DashboardHeader";
import MessagesOverview from "@/components/MessagesOverview";
import MeetingsOverview from "@/components/MeetingsOverview";
import PriorityTasks from "@/components/PriorityTasks";
import ThemeToggle from "@/components/ThemeToggle";
import CategorySelector from "@/components/CategorySelector";
import MiniCalendar from "@/components/MiniCalendar";
import NotesFeature from "@/components/NotesFeature";
import NotificationSettings from "@/components/NotificationSettings";
import MessageDrafting from "@/components/MessageDrafting";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import MeetingPreparation from "@/components/MeetingPreparation";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 dark:text-white transition-colors duration-200">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Work Control Center</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={isRefreshing ? "animate-spin" : ""}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Refresh data</span>
            </Button>
            <ThemeToggle />
          </div>
        </div>
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="mb-8">
            <TabsList className="grid grid-cols-4 w-full max-w-md">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="overview" className="space-y-8">
            <PriorityTasks />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MessagesOverview compact={true} />
              <MeetingsOverview compact={true} />
            </div>
          </TabsContent>
          
          <TabsContent value="messages">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MessagesOverview />
              </div>
              <div className="space-y-8">
                <CategorySelector onChange={setSelectedCategories} />
                <MessageDrafting />
                <AnalyticsDashboard />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="meetings">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MeetingsOverview />
              </div>
              <div className="space-y-8">
                <MiniCalendar />
                <MeetingPreparation />
                <NotesFeature />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <NotificationSettings />
              <div className="space-y-8">
                <MiniCalendar />
                <NotesFeature />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
