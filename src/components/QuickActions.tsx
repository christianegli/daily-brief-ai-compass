
import { Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QuickAction {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

const QuickActions = () => {
  const quickActions: QuickAction[] = [
    {
      id: "schedule",
      name: "Schedule Meeting",
      description: "Create a new calendar event",
      icon: <Zap className="h-4 w-4" />,
      action: () => toast.success("Opening calendar scheduler..."),
    },
    {
      id: "email",
      name: "Compose Email",
      description: "Write a new email message",
      icon: <Zap className="h-4 w-4" />,
      action: () => toast.success("Opening email composer..."),
    },
    {
      id: "task",
      name: "Create Task",
      description: "Add a new task to your list",
      icon: <Zap className="h-4 w-4" />,
      action: () => toast.success("Creating new task..."),
    },
    {
      id: "summarize",
      name: "Summarize Inbox",
      description: "Get an AI summary of unread messages",
      icon: <Zap className="h-4 w-4" />,
      action: () => {
        toast.success("Generating inbox summary...");
        setTimeout(() => {
          toast.success("Summary generated: 12 new emails, 5 urgent, 3 require action");
        }, 1500);
      },
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold flex items-center">
          <Zap className="h-5 w-5 mr-2 text-amber-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center justify-center text-center"
              onClick={action.action}
            >
              <div className="bg-slate-100 rounded-full p-2 mb-2">
                {action.icon}
              </div>
              <span className="font-medium text-sm">{action.name}</span>
              <span className="text-xs text-slate-500 mt-1">{action.description}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
