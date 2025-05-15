
import { useState } from "react";
import { Calendar, Clock, Users, Search, Mail, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Meeting {
  id: number;
  title: string;
  start: string;
  end: string;
  participants: string[];
  description?: string;
  documents?: {
    type: "email" | "slack" | "gdrive";
    title: string;
    link: string;
  }[];
}

interface MeetingsOverviewProps {
  compact?: boolean;
}

const MeetingsOverview = ({ compact = false }: MeetingsOverviewProps) => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  // Mock meetings data
  const meetings: Meeting[] = [
    {
      id: 1,
      title: "Team Weekly Sync",
      start: "Today, 11:00 AM",
      end: "Today, 12:00 PM",
      participants: ["Sarah J.", "Michael T.", "David R.", "You"],
      description: "Weekly team sync to discuss progress and blockers",
      documents: [
        { type: "gdrive", title: "Weekly Report Q2", link: "#" },
        { type: "email", title: "Previous meeting notes", link: "#" },
      ],
    },
    {
      id: 2,
      title: "Client Project Review",
      start: "Today, 2:00 PM",
      end: "Today, 3:30 PM",
      participants: ["John D. (Client)", "Emma S.", "You"],
      description: "Review latest project deliverables with the client",
      documents: [
        { type: "gdrive", title: "Project Timeline", link: "#" },
        { type: "slack", title: "Client feedback thread", link: "#" },
      ],
    },
    {
      id: 3,
      title: "Product Strategy",
      start: "Tomorrow, 10:00 AM",
      end: "Tomorrow, 11:30 AM",
      participants: ["Product Team", "Design Team", "You"],
      description: "Discuss roadmap for next quarter",
    },
    {
      id: 4,
      title: "1:1 with Manager",
      start: "Tomorrow, 4:00 PM",
      end: "Tomorrow, 4:30 PM",
      participants: ["Manager", "You"],
    },
  ];

  const displayMeetings = compact ? meetings.slice(0, 3) : meetings;

  const handleOpenMeetingDetails = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl font-bold">Upcoming Meetings</CardTitle>
          <CardDescription>
            {meetings.length} meetings scheduled
          </CardDescription>
        </div>
        {compact && (
          <Button variant="outline" size="sm">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayMeetings.map((meeting) => (
            <div 
              key={meeting.id}
              className="p-4 border border-slate-200 rounded-lg hover:shadow-sm cursor-pointer transition-shadow"
              onClick={() => handleOpenMeetingDetails(meeting)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{meeting.title}</h3>
                <Badge className="bg-blue-500">{meeting.start.split(',')[0]}</Badge>
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="flex items-center text-sm text-slate-500">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>{meeting.start.split(',')[1]} - {meeting.end.split(',')[1]}</span>
                </div>
                
                <div className="flex items-center text-sm text-slate-500">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{meeting.participants.length} participants</span>
                </div>
              </div>

              <div className="mt-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{meeting.title}</DialogTitle>
                      <DialogDescription>
                        {meeting.start} to {meeting.end}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="py-4">
                      <h4 className="text-sm font-medium mb-2">Participants</h4>
                      <div className="flex flex-wrap gap-2">
                        {meeting.participants.map((participant, i) => (
                          <Badge key={i} variant="outline">{participant}</Badge>
                        ))}
                      </div>
                      
                      {meeting.description && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Description</h4>
                          <p className="text-sm text-slate-600">{meeting.description}</p>
                        </div>
                      )}
                      
                      {meeting.documents && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Related Documents</h4>
                          <div className="space-y-2">
                            {meeting.documents.map((doc, i) => (
                              <a 
                                key={i} 
                                href={doc.link} 
                                className="flex items-center p-2 border rounded-md hover:bg-slate-50"
                              >
                                {doc.type === "gdrive" && (
                                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                    <Search className="h-4 w-4 text-blue-700" />
                                  </div>
                                )}
                                {doc.type === "email" && (
                                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                    <Mail className="h-4 w-4 text-red-700" />
                                  </div>
                                )}
                                {doc.type === "slack" && (
                                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                    <MessageCircle className="h-4 w-4 text-purple-700" />
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium">{doc.title}</div>
                                  <div className="text-xs text-slate-500">
                                    {doc.type === "gdrive" ? "Google Drive" : 
                                     doc.type === "email" ? "Email" : "Slack"}
                                  </div>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline">Join Meeting</Button>
                      <Button>Prepare Notes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingsOverview;
