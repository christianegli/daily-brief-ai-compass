
import { useState } from "react";
import { Bell, Check, Clock, Notebook, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  reminder?: {
    date: Date;
    time: string;
  };
}

const NotesFeature = () => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Meeting with Product Team",
      content: "Discuss new feature priorities for Q3",
      createdAt: new Date(),
    },
  ]);
  
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [reminderDate, setReminderDate] = useState<Date | undefined>(undefined);
  const [reminderTime, setReminderTime] = useState<string | undefined>(undefined);
  
  const addNote = () => {
    if (newNote.title.trim() === "") {
      toast.error("Please add a title to your note");
      return;
    }
    
    const newNoteObject: Note = {
      id: Date.now(),
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date(),
    };
    
    if (reminderDate && reminderTime) {
      newNoteObject.reminder = {
        date: reminderDate,
        time: reminderTime
      };
    }
    
    setNotes([newNoteObject, ...notes]);
    setNewNote({ title: "", content: "" });
    setReminderDate(undefined);
    setReminderTime(undefined);
    setIsAddingNote(false);
    toast.success("Note added successfully");
  };
  
  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.success("Note deleted");
  };

  const clearReminder = () => {
    setReminderDate(undefined);
    setReminderTime(undefined);
  };

  // Time options for the reminder
  const timeOptions = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Notes</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsAddingNote(!isAddingNote)}
        >
          {isAddingNote ? "Cancel" : "Add Note"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isAddingNote && (
            <div className="p-3 border rounded-lg bg-white">
              <input
                type="text"
                placeholder="Note title"
                className="w-full p-2 mb-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
              <textarea
                placeholder="Note content"
                className="w-full p-2 mb-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              />
              
              {/* Reminder section */}
              <div className="flex items-center mb-2 px-2 py-1 border rounded bg-slate-50">
                <Bell className="h-4 w-4 text-slate-500 mr-2" />
                <span className="text-sm text-slate-600 mr-2">Reminder:</span>
                
                {!reminderDate && !reminderTime ? (
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          Set Date
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={reminderDate}
                          onSelect={setReminderDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {reminderDate ? format(reminderDate, "MMM d, yyyy") : "Select date"}
                    </span>
                    
                    {reminderDate && !reminderTime && (
                      <Select onValueChange={setReminderTime}>
                        <SelectTrigger className="h-7 text-xs w-24">
                          <SelectValue placeholder="Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    
                    {reminderDate && reminderTime && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {reminderTime}
                      </span>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 ml-auto text-slate-400"
                      onClick={clearReminder}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsAddingNote(false)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={addNote}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            </div>
          )}
          
          {notes.length === 0 && !isAddingNote ? (
            <div className="text-center py-4 text-slate-500">
              <Notebook className="h-8 w-8 mx-auto mb-2 text-slate-400" />
              <p>No notes yet. Click "Add Note" to create one.</p>
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="p-3 border rounded-lg bg-white hover:shadow transition-shadow">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{note.title}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteNote(note.id)}
                    className="h-6 w-6 p-0 text-slate-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-slate-600 mt-1">{note.content}</p>
                
                {note.reminder && (
                  <div className="flex items-center mt-2 text-xs text-slate-500">
                    <Clock className="h-3 w-3 mr-1 text-blue-500" />
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                      Reminder: {format(note.reminder.date, "MMM d")} at {note.reminder.time}
                    </span>
                  </div>
                )}
                
                <div className="text-xs text-slate-400 mt-2">
                  {note.createdAt.toLocaleDateString()} at {note.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesFeature;
