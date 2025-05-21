
import { supabase } from '@/integrations/supabase/client';

// Types
export interface Message {
  id: string;
  user_id: string;
  platform: 'slack' | 'gmail' | 'whatsapp';
  sender: string;
  content: string;
  created_at: string;
  read_at: string | null;
  is_urgent: boolean;
}

export interface Meeting {
  id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string;
  description: string | null;
  participants: string[];
  documents: {
    type: 'email' | 'slack' | 'gdrive';
    title: string;
    link: string;
  }[] | null;
}

export interface MessageDraft {
  id: string;
  user_id: string;
  recipient: string;
  platform: string;
  content: string;
  last_edited: string;
}

export interface AnalyticsData {
  id: string;
  user_id: string;
  date: string;
  response_times: { day: string; time: number }[];
  message_counts: { platform: string; count: number; color: string }[];
  response_rate: number;
  avg_response_time: number;
  pending_messages: number;
}

// Mock data to use until database tables are created
const mockMessages: Message[] = [
  {
    id: '1',
    user_id: 'current-user',
    platform: 'slack',
    sender: 'John Doe',
    content: 'Hey, can we discuss the project?',
    created_at: new Date().toISOString(),
    read_at: null,
    is_urgent: true
  },
  {
    id: '2',
    user_id: 'current-user',
    platform: 'gmail',
    sender: 'Sarah Smith',
    content: 'I sent you the files you requested',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    read_at: new Date().toISOString(),
    is_urgent: false
  }
];

const mockMeetings: Meeting[] = [
  {
    id: '1',
    user_id: 'current-user',
    title: 'Project Kickoff',
    start_time: new Date(Date.now() + 3600000).toISOString(),
    end_time: new Date(Date.now() + 7200000).toISOString(),
    description: 'Initial discussion about project scope',
    participants: ['John Doe', 'Sarah Smith'],
    documents: [
      { type: 'gdrive', title: 'Project Brief', link: 'https://drive.google.com/doc1' }
    ]
  }
];

const mockDrafts: MessageDraft[] = [
  {
    id: '1',
    user_id: 'current-user',
    recipient: 'team@example.com',
    platform: 'gmail',
    content: 'Draft of the weekly update...',
    last_edited: new Date().toISOString()
  }
];

const mockAnalytics: AnalyticsData = {
  id: '1',
  user_id: 'current-user',
  date: new Date().toISOString(),
  response_times: [
    { day: 'Mon', time: 15 },
    { day: 'Tue', time: 22 },
    { day: 'Wed', time: 18 },
    { day: 'Thu', time: 12 },
    { day: 'Fri', time: 25 }
  ],
  message_counts: [
    { platform: 'Slack', count: 35, color: '#4A154B' },
    { platform: 'Gmail', count: 28, color: '#DB4437' },
    { platform: 'WhatsApp', count: 15, color: '#25D366' }
  ],
  response_rate: 92,
  avg_response_time: 18,
  pending_messages: 3
};

// API Functions - Messages
export const getMessages = async () => {
  // Always return mock data for now
  // This prevents TypeScript errors until the tables are created in Supabase
  return { data: mockMessages, error: null };
};

export const markMessageAsRead = async (messageId: string) => {
  // Use mock implementation
  const updatedMessages = mockMessages.map(msg => {
    if (msg.id === messageId) {
      return { ...msg, read_at: new Date().toISOString() };
    }
    return msg;
  });
  
  return { data: updatedMessages.find(msg => msg.id === messageId) || null, error: null };
};

// API Functions - Meetings
export const getMeetings = async () => {
  // Always return mock data for now
  return { data: mockMeetings, error: null };
};

export const createMeeting = async (meeting: Omit<Meeting, 'id' | 'user_id'>) => {
  // Create a mock implementation
  const newMeeting = {
    id: `mock-${Date.now()}`,
    user_id: 'current-user',
    ...meeting
  };
  
  return { data: newMeeting, error: null };
};

// API Functions - Message Drafts
export const getMessageDrafts = async () => {
  // Always return mock data for now
  return { data: mockDrafts, error: null };
};

export const saveMessageDraft = async (draft: Omit<MessageDraft, 'id' | 'user_id'>) => {
  // Create a mock implementation
  const newDraft = {
    id: `mock-${Date.now()}`,
    user_id: 'current-user',
    ...draft
  };
  
  return { data: newDraft, error: null };
};

export const updateMessageDraft = async (id: string, content: string) => {
  // Use mock implementation
  const updatedDrafts = mockDrafts.map(draft => {
    if (draft.id === id) {
      return { 
        ...draft, 
        content, 
        last_edited: new Date().toISOString() 
      };
    }
    return draft;
  });
  
  return { 
    data: updatedDrafts.find(draft => draft.id === id) || null, 
    error: null 
  };
};

export const deleteMessageDraft = async (id: string) => {
  // In a real implementation, this would delete the draft
  return { error: null };
};

// API Functions - Analytics
export const getAnalytics = async () => {
  // Always return mock data for now
  return { data: mockAnalytics, error: null };
};

// Once you've created the database tables using the SQL commands provided earlier,
// you can replace these mock implementations with the real Supabase API calls.
// Here's a commented example of how the real implementation would look:

/*
export const getMessages = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: mockMessages, error: null };

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return { data: data || mockMessages, error: null };
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { data: mockMessages, error };
  }
};
*/
