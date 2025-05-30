export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          avg_response_time: number | null
          date: string
          id: string
          message_counts: Json | null
          pending_messages: number | null
          response_rate: number | null
          response_times: Json | null
          user_id: string
        }
        Insert: {
          avg_response_time?: number | null
          date?: string
          id?: string
          message_counts?: Json | null
          pending_messages?: number | null
          response_rate?: number | null
          response_times?: Json | null
          user_id: string
        }
        Update: {
          avg_response_time?: number | null
          date?: string
          id?: string
          message_counts?: Json | null
          pending_messages?: number | null
          response_rate?: number | null
          response_times?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      content_summaries: {
        Row: {
          created_at: string
          id: string
          is_urgent: boolean | null
          original_content: string | null
          priority_score: number | null
          processed_at: string
          source_id: string | null
          source_type: string
          summary: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          original_content?: string | null
          priority_score?: number | null
          processed_at?: string
          source_id?: string | null
          source_type: string
          summary: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_urgent?: boolean | null
          original_content?: string | null
          priority_score?: number | null
          processed_at?: string
          source_id?: string | null
          source_type?: string
          summary?: string
          user_id?: string
        }
        Relationships: []
      }
      integration_settings: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          integration_type: string
          is_connected: boolean
          refresh_token: string | null
          settings: Json | null
          token_expiry: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          integration_type: string
          is_connected?: boolean
          refresh_token?: string | null
          settings?: Json | null
          token_expiry?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          integration_type?: string
          is_connected?: boolean
          refresh_token?: string | null
          settings?: Json | null
          token_expiry?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meetings: {
        Row: {
          description: string | null
          documents: Json | null
          end_time: string
          id: string
          participants: string[]
          start_time: string
          title: string
          user_id: string
        }
        Insert: {
          description?: string | null
          documents?: Json | null
          end_time: string
          id?: string
          participants?: string[]
          start_time: string
          title: string
          user_id: string
        }
        Update: {
          description?: string | null
          documents?: Json | null
          end_time?: string
          id?: string
          participants?: string[]
          start_time?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      message_drafts: {
        Row: {
          content: string
          id: string
          last_edited: string
          platform: string
          recipient: string
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          last_edited?: string
          platform: string
          recipient: string
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          last_edited?: string
          platform?: string
          recipient?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_urgent: boolean
          platform: string
          read_at: string | null
          sender: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_urgent?: boolean
          platform: string
          read_at?: string | null
          sender: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_urgent?: boolean
          platform?: string
          read_at?: string | null
          sender?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
