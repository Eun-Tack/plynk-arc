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
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          age: number | null
          occupation: string | null
          subscription_tier: 'free' | 'arc_subscription'
          arc_limit: number
          daily_summary_enabled: boolean
          daily_summary_time: string
          daily_summary_min_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          age?: number | null
          occupation?: string | null
          subscription_tier?: 'free' | 'arc_subscription'
          arc_limit?: number
          daily_summary_enabled?: boolean
          daily_summary_time?: string
          daily_summary_min_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          age?: number | null
          occupation?: string | null
          subscription_tier?: 'free' | 'arc_subscription'
          arc_limit?: number
          daily_summary_enabled?: boolean
          daily_summary_time?: string
          daily_summary_min_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      arcs: {
        Row: {
          id: string
          user_id: string
          name: string
          goal: string | null
          icon: string
          color: string
          is_public: boolean
          share_token: string
          auto_synthesis_enabled: boolean
          auto_synthesis_threshold: number
          resource_count: number
          last_synthesis_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          goal?: string | null
          icon?: string
          color?: string
          is_public?: boolean
          share_token?: string
          auto_synthesis_enabled?: boolean
          auto_synthesis_threshold?: number
          resource_count?: number
          last_synthesis_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          goal?: string | null
          icon?: string
          color?: string
          is_public?: boolean
          share_token?: string
          auto_synthesis_enabled?: boolean
          auto_synthesis_threshold?: number
          resource_count?: number
          last_synthesis_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          arc_id: string
          user_id: string
          url: string | null
          file_url: string | null
          file_name: string | null
          file_size: number | null
          mime_type: string | null
          title: string
          summary: string | null
          content: string | null
          category: string | null
          favicon_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          arc_id: string
          user_id: string
          url?: string | null
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          mime_type?: string | null
          title: string
          summary?: string | null
          content?: string | null
          category?: string | null
          favicon_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          arc_id?: string
          user_id?: string
          url?: string | null
          file_url?: string | null
          file_name?: string | null
          file_size?: number | null
          mime_type?: string | null
          title?: string
          summary?: string | null
          content?: string | null
          category?: string | null
          favicon_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: number
          user_id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      link_tags: {
        Row: {
          resource_id: string
          tag_id: number
          created_at: string
        }
        Insert: {
          resource_id: string
          tag_id: number
          created_at?: string
        }
        Update: {
          resource_id?: string
          tag_id?: number
          created_at?: string
        }
      }
      synthesis_history: {
        Row: {
          id: string
          arc_id: string
          user_id: string
          resource_count: number
          date_range_start: string | null
          date_range_end: string | null
          summary: string | null
          insights: Json | null
          patterns: Json | null
          table_schema: Json | null
          table_data: Json | null
          status: 'pending' | 'processing' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          arc_id: string
          user_id: string
          resource_count: number
          date_range_start?: string | null
          date_range_end?: string | null
          summary?: string | null
          insights?: Json | null
          patterns?: Json | null
          table_schema?: Json | null
          table_data?: Json | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          arc_id?: string
          user_id?: string
          resource_count?: number
          date_range_start?: string | null
          date_range_end?: string | null
          summary?: string | null
          insights?: Json | null
          patterns?: Json | null
          table_schema?: Json | null
          table_data?: Json | null
          status?: 'pending' | 'processing' | 'completed' | 'failed'
          created_at?: string
        }
      }
      daily_summaries: {
        Row: {
          id: string
          user_id: string
          arc_id: string | null
          date: string
          resource_count: number
          summary: string
          key_findings: Json | null
          recommended_actions: Json | null
          email_sent: boolean
          email_sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          arc_id?: string | null
          date: string
          resource_count: number
          summary: string
          key_findings?: Json | null
          recommended_actions?: Json | null
          email_sent?: boolean
          email_sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          arc_id?: string | null
          date?: string
          resource_count?: number
          summary?: string
          key_findings?: Json | null
          recommended_actions?: Json | null
          email_sent?: boolean
          email_sent_at?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          link_url: string | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          link_url?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          link_url?: string | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_create_box: {
        Args: { p_user_id: string }
        Returns: boolean
      }
      get_duplicate_urls: {
        Args: { p_user_id: string; p_url: string }
        Returns: {
          arc_id: string
          box_name: string
          resource_id: string
          created_at: string
        }[]
      }
    }
    Enums: {
      subscription_tier: 'free' | 'arc_subscription'
      gender_type: 'male' | 'female' | 'other' | 'prefer_not_to_say'
      synthesis_status: 'pending' | 'processing' | 'completed' | 'failed'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type UserProfile = Tables<'user_profiles'>
export type Arc = Tables<'arcs'>
export type Resource = Tables<'resources'>
export type Tag = Tables<'tags'>
export type LinkTag = Tables<'link_tags'>
export type SynthesisHistory = Tables<'synthesis_history'>
export type DailySummary = Tables<'daily_summaries'>
export type Notification = Tables<'notifications'>

// Extended types with relations
export type ResourceWithTags = Resource & {
  tags: Tag[]
}

export type ArcWithResources = Arc & {
  resources: Resource[]
}
