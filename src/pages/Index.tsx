
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHeader from "@/components/DashboardHeader";
import MessagesOverview from "@/components/MessagesOverview";
import MeetingsOverview from "@/components/MeetingsOverview";
import PriorityTasks from "@/components/PriorityTasks";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="mb-8">
            <TabsList className="grid grid-cols-3 w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="meetings">Meetings</TabsTrigger>
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
            <MessagesOverview />
          </TabsContent>
          
          <TabsContent value="meetings">
            <MeetingsOverview />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
