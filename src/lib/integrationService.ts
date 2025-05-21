
import { supabase } from "@/integrations/supabase/client";

// Type definitions
export interface IntegrationSettings {
  id: string;
  user_id: string;
  integration_type: 'google' | 'slack' | 'openai';
  is_connected: boolean;
  access_token?: string;
  refresh_token?: string;
  token_expiry?: string;
  settings?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContentSummary {
  id: string;
  user_id: string;
  source_id: string | null;
  source_type: 'email' | 'slack' | 'calendar' | 'message';
  original_content: string | null;
  summary: string;
  priority_score: number | null;
  is_urgent: boolean | null;
  created_at: string;
  processed_at: string;
}

export interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone: string };
  end: { dateTime: string; timeZone: string };
  attendees?: { email: string; displayName?: string }[];
}

export interface GoogleEmail {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    headers: { name: string; value: string }[];
    parts?: any[];
    mimeType: string;
    body?: { size: number; data?: string };
  };
}

export interface SlackChannel {
  channelName: string;
  channelId: string;
  messages: Array<{
    type: string;
    user: string;
    text: string;
    ts: string;
  }>;
}

// Main service class
export class IntegrationService {
  // Check if the user has connected a specific integration
  async isIntegrationConnected(userId: string, integrationType: 'google' | 'slack' | 'openai'): Promise<boolean> {
    const { data, error } = await supabase
      .from('integration_settings')
      .select('is_connected')
      .eq('user_id', userId)
      .eq('integration_type', integrationType)
      .single();
    
    if (error || !data) return false;
    return data.is_connected;
  }
  
  // Generate OAuth URLs
  async getGoogleAuthUrl(userId: string): Promise<string | null> {
    try {
      const { data } = await supabase.functions.invoke('google-integration', {
        body: { userId },
        query: { userId }
      });
      return data.authUrl;
    } catch (error) {
      console.error('Error getting Google auth URL:', error);
      return null;
    }
  }
  
  async getSlackAuthUrl(userId: string): Promise<string | null> {
    try {
      const { data } = await supabase.functions.invoke('slack-integration', {
        body: { userId },
        query: { userId }
      });
      return data.authUrl;
    } catch (error) {
      console.error('Error getting Slack auth URL:', error);
      return null;
    }
  }
  
  // Fetch data from connected services
  async getGoogleEvents(userId: string): Promise<GoogleEvent[]> {
    try {
      const { data, error } = await supabase.functions.invoke('google-integration/get-events', {
        body: { userId }
      });
      
      if (error) throw error;
      return data.events || [];
    } catch (error) {
      console.error('Error fetching Google events:', error);
      return [];
    }
  }
  
  async getGoogleEmails(userId: string): Promise<GoogleEmail[]> {
    try {
      const { data, error } = await supabase.functions.invoke('google-integration/get-emails', {
        body: { userId }
      });
      
      if (error) throw error;
      return data.emails || [];
    } catch (error) {
      console.error('Error fetching Google emails:', error);
      return [];
    }
  }
  
  async getSlackMessages(userId: string): Promise<SlackChannel[]> {
    try {
      const { data, error } = await supabase.functions.invoke('slack-integration/get-messages', {
        body: { userId }
      });
      
      if (error) throw error;
      return data.channels || [];
    } catch (error) {
      console.error('Error fetching Slack messages:', error);
      return [];
    }
  }
  
  // Process and summarize content
  async summarizeContent(
    userId: string,
    sourceType: 'email' | 'slack' | 'calendar' | 'message',
    content: string,
    sourceId?: string
  ): Promise<ContentSummary | null> {
    try {
      const { data, error } = await supabase.functions.invoke('summarize-content', {
        body: {
          userId,
          sourceType,
          content,
          sourceId
        }
      });
      
      if (error) throw error;
      return data.summary || null;
    } catch (error) {
      console.error('Error summarizing content:', error);
      return null;
    }
  }
  
  // Get all content summaries for a user
  async getContentSummaries(userId: string): Promise<ContentSummary[]> {
    const { data, error } = await supabase
      .from('content_summaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching content summaries:', error);
      return [];
    }
    
    return data || [];
  }
}

export const integrationService = new IntegrationService();
