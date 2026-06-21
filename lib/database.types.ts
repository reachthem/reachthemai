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
      user_data: {
        Row: {
          id: string
          user_id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          user_role: 'free' | 'pro' | 'admin' | 'starter' | 'enterprise' | 'business' | 'professional'
          subscription_tier: string
          credits: number
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          user_role?: 'free' | 'pro' | 'admin' | 'starter' | 'enterprise' | 'business' | 'professional'
          subscription_tier?: string
          credits?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          user_role?: 'free' | 'pro' | 'admin' | 'starter' | 'enterprise' | 'business' | 'professional'
          subscription_tier?: string
          credits?: number
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_data_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']

export type UserData = Tables<'user_data'>
export type UserRole = UserData['user_role']
