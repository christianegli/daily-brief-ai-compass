
import { useState } from "react";
import { format, addDays, isSameDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const MiniCalendar = () => {
  const [date, setDate] = useState<Date>(new Date());
  
  // Mock data for days with meetings
  const meetingDays = [
    new Date(),
    addDays(new Date(), 2),
    addDays(new Date(), 5),
    addDays(new Date(), 7),
  ];
  
  // Function to highlight meeting days
  const isDayWithMeeting = (day: Date) => {
    return meetingDays.some(meetingDay => isSameDay(meetingDay, day));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Calendar</CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Full View
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md p-3 pointer-events-auto"
              modifiers={{
                meeting: (date) => isDayWithMeeting(date),
              }}
              modifiersClassNames={{
                meeting: "bg-blue-100 text-blue-900 font-bold",
              }}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium">Today: {format(new Date(), "MMMM d, yyyy")}</p>
          <div className="grid grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-xs font-medium text-slate-500">
                {day}
              </div>
            ))}
            {Array.from({ length: 7 }, (_, i) => {
              const currentDay = addDays(new Date(), i - 3);
              const isToday = isSameDay(currentDay, new Date());
              const hasMeeting = isDayWithMeeting(currentDay);
              
              return (
                <div 
                  key={i} 
                  className={`
                    text-xs p-1.5 rounded-full
                    ${isToday ? 'bg-blue-500 text-white' : ''}
                    ${!isToday && hasMeeting ? 'bg-blue-100 text-blue-800' : ''}
                    ${!isToday && !hasMeeting ? 'hover:bg-slate-100 cursor-pointer' : ''}
                  `}
                >
                  {format(currentDay, "d")}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniCalendar;
