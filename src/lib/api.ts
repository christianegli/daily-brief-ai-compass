
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

export const markMessageAsRead = async (messageId: string) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error('Not authenticated') };

  try {
    const { data, error } = await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('id', messageId);
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error marking message as read:', error);
    return { data: null, error };
  }
};

// API Functions - Meetings
export const getMeetings = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: mockMeetings, error: null };

  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('user_id', user.user.id)
      .order('start_time', { ascending: true });
    
    if (error) throw error;
    return { data: data || mockMeetings, error: null };
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return { data: mockMeetings, error };
  }
};

export const createMeeting = async (meeting: Omit<Meeting, 'id' | 'user_id'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error('Not authenticated') };

  try {
    const { data, error } = await supabase
      .from('meetings')
      .insert([{ ...meeting, user_id: user.user.id }])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating meeting:', error);
    return { data: null, error };
  }
};

// API Functions - Message Drafts
export const getMessageDrafts = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: mockDrafts, error: null };

  try {
    const { data, error } = await supabase
      .from('message_drafts')
      .select('*')
      .eq('user_id', user.user.id)
      .order('last_edited', { ascending: false });
    
    if (error) throw error;
    return { data: data || mockDrafts, error: null };
  } catch (error) {
    console.error('Error fetching message drafts:', error);
    return { data: mockDrafts, error };
  }
};

export const saveMessageDraft = async (draft: Omit<MessageDraft, 'id' | 'user_id'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error('Not authenticated') };

  try {
    const { data, error } = await supabase
      .from('message_drafts')
      .insert([{ ...draft, user_id: user.user.id }])
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error saving message draft:', error);
    return { data: null, error };
  }
};

export const updateMessageDraft = async (id: string, content: string) => {
  try {
    const { data, error } = await supabase
      .from('message_drafts')
      .update({ 
        content, 
        last_edited: new Date().toISOString() 
      })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating message draft:', error);
    return { data: null, error };
  }
};

export const deleteMessageDraft = async (id: string) => {
  try {
    const { error } = await supabase
      .from('message_drafts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting message draft:', error);
    return { error };
  }
};

// API Functions - Analytics
export const getAnalytics = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: mockAnalytics, error: null };

  try {
    const { data, error } = await supabase
      .from('analytics')
      .select('*')
      .eq('user_id', user.user.id)
      .order('date', { ascending: false })
      .limit(1);
    
    if (error) throw error;
    return { data: data?.[0] || mockAnalytics, error: null };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return { data: mockAnalytics, error };
  }
};
