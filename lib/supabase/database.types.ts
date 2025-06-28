export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          theme: string
          joined_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          theme?: string
          joined_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          theme?: string
          joined_at?: string
          updated_at?: string
        }
      }
      voice_sessions: {
        Row: {
          id: string
          user_id: string
          title: string
          transcript: string
          duration: number
          emotions: Json
          ai_response: string
          mood_score: number | null
          tags: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          transcript: string
          duration: number
          emotions: Json
          ai_response: string
          mood_score?: number | null
          tags?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          transcript?: string
          duration?: number
          emotions?: Json
          ai_response?: string
          mood_score?: number | null
          tags?: string[]
          created_at?: string
        }
      }
      mood_entries: {
        Row: {
          id: string
          user_id: string
          mood: number
          emotions: string[]
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood: number
          emotions?: string[]
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood?: number
          emotions?: string[]
          note?: string | null
          created_at?: string
        }
      }
      notes: {
        Row: {
          id: string
          user_id: string
          title: string
          content: string
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          voice_reminders: boolean
          notifications: boolean
          privacy_level: string
          crisis_contacts: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          voice_reminders?: boolean
          notifications?: boolean
          privacy_level?: string
          crisis_contacts?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          voice_reminders?: boolean
          notifications?: boolean
          privacy_level?: string
          crisis_contacts?: Json
          created_at?: string
          updated_at?: string
        }
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