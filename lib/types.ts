export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          id: string
          option_key: string
          option_value: string | null
          option_label: string | null
          option_description: string | null
          is_public: boolean | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          option_key: string
          option_value?: string | null
          option_label?: string | null
          option_description?: string | null
          is_public?: boolean | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          option_key?: string
          option_value?: string | null
          option_label?: string | null
          option_description?: string | null
          is_public?: boolean | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      removal_knowledge_base: {
        Row: {
          created_at: string
          escalation_note: string | null
          expected_timeline: string | null
          ground: string
          ground_label: string
          id: string
          is_active: boolean | null
          last_verified: string | null
          platform: string
          qualification_criteria: string
          removal_steps: string
          required_info: string
          success_rate: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          escalation_note?: string | null
          expected_timeline?: string | null
          ground: string
          ground_label: string
          id?: string
          is_active?: boolean | null
          last_verified?: string | null
          platform: string
          qualification_criteria: string
          removal_steps: string
          required_info: string
          success_rate?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          escalation_note?: string | null
          expected_timeline?: string | null
          ground?: string
          ground_label?: string
          id?: string
          is_active?: boolean | null
          last_verified?: string | null
          platform?: string
          qualification_criteria?: string
          removal_steps?: string
          required_info?: string
          success_rate?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      review_cases: {
        Row: {
          ai_analyzed_at: string | null
          ai_confidence: string | null
          ai_removal_ground: string | null
          ai_session_id: string | null
          ai_strategy: string | null
          billing_history_id: string | null
          created_at: string
          has_responded: boolean | null
          id: string
          last_verified_at: string | null
          platform: string
          removal_method: string | null
          removal_reasons: string[] | null
          removal_request_id: string | null
          removal_submitted_at: string | null
          removed_at: string | null
          review_date: string | null
          review_rating: number | null
          review_text: string | null
          review_url: string
          reviewer_context: string | null
          reviewer_name: string | null
          status: string
          status_history: Json | null
          status_notes: string | null
          updated_at: string
          user_id: string
          user_response: string | null
        }
        Insert: {
          ai_analyzed_at?: string | null
          ai_confidence?: string | null
          ai_removal_ground?: string | null
          ai_session_id?: string | null
          ai_strategy?: string | null
          billing_history_id?: string | null
          created_at?: string
          has_responded?: boolean | null
          id?: string
          last_verified_at?: string | null
          platform: string
          removal_method?: string | null
          removal_reasons?: string[] | null
          removal_request_id?: string | null
          removal_submitted_at?: string | null
          removed_at?: string | null
          review_date?: string | null
          review_rating?: number | null
          review_text?: string | null
          review_url: string
          reviewer_context?: string | null
          reviewer_name?: string | null
          status?: string
          status_history?: Json | null
          status_notes?: string | null
          updated_at?: string
          user_id: string
          user_response?: string | null
        }
        Update: {
          ai_analyzed_at?: string | null
          ai_confidence?: string | null
          ai_removal_ground?: string | null
          ai_session_id?: string | null
          ai_strategy?: string | null
          billing_history_id?: string | null
          created_at?: string
          has_responded?: boolean | null
          id?: string
          last_verified_at?: string | null
          platform?: string
          removal_method?: string | null
          removal_reasons?: string[] | null
          removal_request_id?: string | null
          removal_submitted_at?: string | null
          removed_at?: string | null
          review_date?: string | null
          review_rating?: number | null
          review_text?: string | null
          review_url?: string
          reviewer_context?: string | null
          reviewer_name?: string | null
          status?: string
          status_history?: Json | null
          status_notes?: string | null
          updated_at?: string
          user_id?: string
          user_response?: string | null
        }
        Relationships: []
      }
      user_data: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string
          credits: number
          email: string | null
          full_name: string | null
          id: string
          phone_number: string | null
          settings: Json
          subscription_tier: string
          updated_at: string
          user_id: string
          user_role: string
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          credits?: number
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          settings?: Json
          subscription_tier?: string
          updated_at?: string
          user_id: string
          user_role?: string
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string
          credits?: number
          email?: string | null
          full_name?: string | null
          id?: string
          phone_number?: string | null
          settings?: Json
          subscription_tier?: string
          updated_at?: string
          user_id?: string
          user_role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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

export const Constants = {
  public: {
    Enums: {},
  },
} as const
