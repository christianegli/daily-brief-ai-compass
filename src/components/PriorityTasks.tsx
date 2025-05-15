
import { Calendar, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PriorityTasks = () => {
  // Mock data for priority tasks
  const priorityTasks = [
    {
      id: 1,
      type: "meeting",
      title: "Quarterly Review Meeting",
      description: "Prepare quarterly results with team",
      time: "Today, 2:00 PM",
      urgent: true,
    },
    {
      id: 2,
      type: "email",
      title: "Client Proposal Response",
      description: "Pending for 3 days - high priority",
      sender: "john@acmecorp.com",
      urgent: true,
    },
    {
      id: 3,
      type: "slack",
      title: "Product team question",
      description: "Sarah asked about the release timeline",
      channel: "#product",
      time: "Yesterday",
      urgent: false,
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Priority Tasks</CardTitle>
          <CardDescription>Attend to these items first</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {priorityTasks.map((task) => (
            <div key={task.id} className="flex items-start p-3 bg-white border rounded-lg hover:shadow transition-shadow">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                task.type === "meeting" 
                  ? "bg-blue-100" 
                  : task.type === "email" 
                  ? "bg-amber-100" 
                  : "bg-green-100"
              }`}>
                {task.type === "meeting" && <Calendar className="h-5 w-5 text-blue-600" />}
                {task.type === "email" && <AlertCircle className="h-5 w-5 text-amber-600" />}
                {task.type === "slack" && <MessageCircle className="h-5 w-5 text-green-600" />}
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{task.title}</h4>
                  {task.urgent && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-slate-500 text-sm">{task.description}</p>
                <div className="flex items-center mt-2 text-xs text-slate-400">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>{task.time || "Pending"}</span>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="ml-2">
                Open
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PriorityTasks;
