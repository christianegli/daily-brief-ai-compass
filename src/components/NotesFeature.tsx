
import { useState } from "react";
import { Check, Note, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
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
    
    setNotes([newNoteObject, ...notes]);
    setNewNote({ title: "", content: "" });
    setIsAddingNote(false);
    toast.success("Note added successfully");
  };
  
  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.success("Note deleted");
  };

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
              <Note className="h-8 w-8 mx-auto mb-2 text-slate-400" />
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
