
import { FileText, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MeetingResource {
  id: number;
  title: string;
  source: "email" | "slack" | "drive";
  date: string;
  relevance: number; // 1-10
}

interface UpcomingMeeting {
  id: number;
  title: string;
  time: string;
  participants: string[];
  resources: MeetingResource[];
}

const MeetingPreparation = () => {
  // Mock upcoming meeting with relevant resources
  const upcomingMeeting: UpcomingMeeting = {
    id: 1,
    title: "Quarterly Review Meeting",
    time: "Today, 2:00 PM",
    participants: ["John Smith", "Sarah Jones", "Mike Johnson"],
    resources: [
      {
        id: 1,
        title: "Q3 Performance Report.pdf",
        source: "drive",
        date: "3 days ago",
        relevance: 9,
      },
      {
        id: 2,
        title: "Previous meeting notes",
        source: "slack",
        date: "2 weeks ago",
        relevance: 7,
      },
      {
        id: 3,
        title: "Project timeline discussion",
        source: "email",
        date: "1 week ago",
        relevance: 8,
      },
    ],
  };
  
  const refreshResources = () => {
    toast.success("Refreshing relevant resources...");
    // In a real app, this would fetch updated resources
    setTimeout(() => {
      toast.success("Resources updated successfully");
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          <CardTitle className="text-xl font-bold">Meeting Preparation</CardTitle>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshResources}
        >
          <Search className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">{upcomingMeeting.title}</h3>
            <p className="text-sm text-slate-500">{upcomingMeeting.time}</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {upcomingMeeting.participants.map((participant, i) => (
                <span 
                  key={i} 
                  className="text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full"
                >
                  {participant}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Relevant Resources</h4>
            <div className="space-y-2">
              {upcomingMeeting.resources.map((resource) => (
                <div 
                  key={resource.id} 
                  className="border rounded-lg p-3 flex items-start"
                >
                  <div className={`
                    h-8 w-8 rounded-md flex items-center justify-center mr-3
                    ${resource.source === 'drive' ? 'bg-blue-100 text-blue-600' : 
                      resource.source === 'email' ? 'bg-amber-100 text-amber-600' : 
                      'bg-green-100 text-green-600'}
                  `}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="font-medium text-sm">{resource.title}</h5>
                      <span className="text-xs text-slate-500">{resource.date}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-slate-500 capitalize">{resource.source}</span>
                      <div className="ml-auto flex items-center">
                        <span className="text-xs text-slate-500 mr-1">Relevance:</span>
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${resource.relevance * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <Button className="w-full" variant="default" size="sm">
            Open All Resources
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingPreparation;
