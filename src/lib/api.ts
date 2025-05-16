
import { supabase } from './supabase';

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

// API Functions - Messages
export const getMessages = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const markMessageAsRead = async (messageId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ read_at: new Date().toISOString() })
    .eq('id', messageId);

  return { data, error };
};

// API Functions - Meetings
export const getMeetings = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .eq('user_id', user.user.id)
    .order('start_time', { ascending: true });

  return { data, error };
};

export const createMeeting = async (meeting: Omit<Meeting, 'id' | 'user_id'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('meetings')
    .insert([{ ...meeting, user_id: user.user.id }])
    .select();

  return { data, error };
};

// API Functions - Message Drafts
export const getMessageDrafts = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('message_drafts')
    .select('*')
    .eq('user_id', user.user.id)
    .order('last_edited', { ascending: false });

  return { data, error };
};

export const saveMessageDraft = async (draft: Omit<MessageDraft, 'id' | 'user_id'>) => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('message_drafts')
    .insert([{ ...draft, user_id: user.user.id }])
    .select();

  return { data, error };
};

export const updateMessageDraft = async (id: string, content: string) => {
  const { data, error } = await supabase
    .from('message_drafts')
    .update({ 
      content, 
      last_edited: new Date().toISOString() 
    })
    .eq('id', id)
    .select();

  return { data, error };
};

export const deleteMessageDraft = async (id: string) => {
  const { error } = await supabase
    .from('message_drafts')
    .delete()
    .eq('id', id);

  return { error };
};

// API Functions - Analytics
export const getAnalytics = async () => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return { data: null, error: new Error('Not authenticated') };

  const { data, error } = await supabase
    .from('analytics')
    .select('*')
    .eq('user_id', user.user.id)
    .order('date', { ascending: false })
    .limit(1);

  return { data: data?.[0], error };
};
