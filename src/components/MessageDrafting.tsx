
import { useState } from "react";
import { MessageSquare, Send, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MessageDraft {
  id: number;
  recipient: string;
  platform: string;
  content: string;
  lastEdited: Date;
}

const MessageDrafting = () => {
  const [drafts, setDrafts] = useState<MessageDraft[]>([
    {
      id: 1,
      recipient: "John (Slack)",
      platform: "slack",
      content: "Let's schedule that meeting for next week. How does Tuesday at 2pm work?",
      lastEdited: new Date(),
    },
  ]);
  
  const [activeDraft, setActiveDraft] = useState<MessageDraft | null>(null);
  const [draftContent, setDraftContent] = useState("");
  
  const startNewDraft = () => {
    const newDraft = {
      id: Date.now(),
      recipient: "New Recipient",
      platform: "email",
      content: "",
      lastEdited: new Date(),
    };
    
    setDrafts([newDraft, ...drafts]);
    setActiveDraft(newDraft);
    setDraftContent("");
  };
  
  const editDraft = (draft: MessageDraft) => {
    setActiveDraft(draft);
    setDraftContent(draft.content);
  };
  
  const saveDraft = () => {
    if (!activeDraft) return;
    
    const updatedDrafts = drafts.map(draft => 
      draft.id === activeDraft.id 
        ? { ...draft, content: draftContent, lastEdited: new Date() } 
        : draft
    );
    
    setDrafts(updatedDrafts);
    setActiveDraft(null);
    toast.success("Draft saved successfully");
  };
  
  const sendMessage = () => {
    if (!activeDraft) return;
    
    // In a real app, this would send the message via an API
    toast.success(`Message sent to ${activeDraft.recipient}`);
    
    // Remove from drafts
    setDrafts(drafts.filter(draft => draft.id !== activeDraft.id));
    setActiveDraft(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Message Drafts</CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={startNewDraft}
          disabled={activeDraft !== null}
        >
          New Draft
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeDraft ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">To: {activeDraft.recipient}</h3>
                <div className="text-xs text-slate-500">
                  {activeDraft.platform}
                </div>
              </div>
              <textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                placeholder="Write your message here..."
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={saveDraft}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={sendMessage}
                  disabled={draftContent.trim() === ""}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <>
              {drafts.length === 0 ? (
                <div className="text-center py-6 text-slate-500">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                  <p>No drafts yet. Click "New Draft" to create one.</p>
                </div>
              ) : (
                drafts.map((draft) => (
                  <div 
                    key={draft.id} 
                    className="p-3 border rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => editDraft(draft)}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium">{draft.recipient}</h3>
                      <div className="text-xs text-slate-500">
                        {new Date(draft.lastEdited).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {draft.content || <span className="italic text-slate-400">No content</span>}
                    </p>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MessageDrafting;
