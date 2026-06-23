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
      automations: {
        Row: {
          id: string
          user_id: string
          keyword_phrases: Json
          automatically_get_contact_data: boolean
          status: string
          current_keyword_index: number
          page_token: string | null
          created_at: string
          updated_at: string
          name: string | null
          max_contacts: number | null
          contacts_found: number
          contact_ai_model: string | null
          assign_to_list_id: string | null
          validate_emails: boolean
          filter_rating_min: number | null
          filter_has_website: string | null
          filter_min_reviews: number | null
          filter_max_reviews: number | null
          search_radius_miles: number | null
          total_runs: number
          credits_used: number
          do_not_add_without_contact: boolean
          emails_found: number
          emails_validated: number
        }
        Insert: {
          id?: string
          user_id: string
          keyword_phrases?: Json
          automatically_get_contact_data?: boolean
          status?: string
          current_keyword_index?: number
          page_token?: string | null
          created_at?: string
          updated_at?: string
          name?: string | null
          max_contacts?: number | null
          contacts_found?: number
          contact_ai_model?: string | null
          assign_to_list_id?: string | null
          validate_emails?: boolean
          filter_rating_min?: number | null
          filter_has_website?: string | null
          filter_min_reviews?: number | null
          filter_max_reviews?: number | null
          search_radius_miles?: number | null
          total_runs?: number
          credits_used?: number
          do_not_add_without_contact?: boolean
          emails_found?: number
          emails_validated?: number
        }
        Update: {
          id?: string
          user_id?: string
          keyword_phrases?: Json
          automatically_get_contact_data?: boolean
          status?: string
          current_keyword_index?: number
          page_token?: string | null
          created_at?: string
          updated_at?: string
          name?: string | null
          max_contacts?: number | null
          contacts_found?: number
          contact_ai_model?: string | null
          assign_to_list_id?: string | null
          validate_emails?: boolean
          filter_rating_min?: number | null
          filter_has_website?: string | null
          filter_min_reviews?: number | null
          filter_max_reviews?: number | null
          search_radius_miles?: number | null
          total_runs?: number
          credits_used?: number
          do_not_add_without_contact?: boolean
          emails_found?: number
          emails_validated?: number
        }
        Relationships: []
      }
      contact_lists: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_list_members: {
        Row: {
          id: string
          contact_list_id: string
          saved_contact_id: string
          created_at: string
        }
        Insert: {
          id?: string
          contact_list_id: string
          saved_contact_id: string
          created_at?: string
        }
        Update: {
          id?: string
          contact_list_id?: string
          saved_contact_id?: string
          created_at?: string
        }
        Relationships: []
      }
      saved_contacts: {
        Row: {
          id: string
          user_id: string
          automation_id: string | null
          place_id: string
          name: string | null
          address: string | null
          phone: string | null
          website: string | null
          rating: number | null
          total_reviews: number | null
          primary_type: string | null
          maps_url: string | null
          created_at: string
          updated_at: string
          email_address: string | null
          contact_first_name: string | null
          contact_last_name: string | null
          email_validation_status: string | null
          email_series: { subject: string; body: string; created_at: string; model: string; prompt: string }[] | null
          contact_model: string | null
        }
        Insert: {
          id?: string
          user_id: string
          automation_id?: string | null
          place_id: string
          name?: string | null
          address?: string | null
          phone?: string | null
          website?: string | null
          rating?: number | null
          total_reviews?: number | null
          primary_type?: string | null
          maps_url?: string | null
          created_at?: string
          updated_at?: string
          email_address?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          email_validation_status?: string | null
          email_series?: { subject: string; body: string; created_at: string; model: string; prompt: string }[] | null
          contact_model?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          automation_id?: string | null
          place_id?: string
          name?: string | null
          address?: string | null
          phone?: string | null
          website?: string | null
          rating?: number | null
          total_reviews?: number | null
          primary_type?: string | null
          maps_url?: string | null
          created_at?: string
          updated_at?: string
          email_address?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          email_validation_status?: string | null
          email_series?: { subject: string; body: string; created_at: string; model: string; prompt: string }[] | null
          contact_model?: string | null
        }
        Relationships: []
      }
      billing_history: {
        Row: {
          amount: number
          billing_date: string
          created_at: string
          currency: string
          description: string | null
          id: string
          plan_key: string | null
          plan_name: string | null
          status: string
          stripe_customer_id: string | null
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          billing_date?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          plan_key?: string | null
          plan_name?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          billing_date?: string
          created_at?: string
          currency?: string
          description?: string | null
          id?: string
          plan_key?: string | null
          plan_name?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          user_id?: string
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
      removal_requests: {
        Row: {
          admin_notes: string | null
          billing_history_id: string | null
          contact_email: string
          review_author: string | null
          contact_phone: string | null
          created_at: string
          current_step: number
          description: string | null
          draft_key: string
          evidence_urls: Json | null
          id: string
          platform: string | null
          removal_reason: string | null
          review_content: string | null
          review_date: string | null
          review_rating: number | null
          review_url: string | null
          status: string
          status_history: Json | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          billing_history_id?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          current_step?: number
          description?: string | null
          draft_key?: string
          evidence_urls?: Json | null
          id?: string
          platform?: string | null
          removal_reason?: string | null
          review_author?: string | null
          review_content?: string | null
          review_date?: string | null
          review_rating?: number | null
          review_url?: string | null
          status?: string
          status_history?: Json | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          billing_history_id?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          current_step?: number
          description?: string | null
          draft_key?: string
          evidence_urls?: Json | null
          id?: string
          platform?: string | null
          removal_reason?: string | null
          review_author?: string | null
          review_content?: string | null
          review_date?: string | null
          review_rating?: number | null
          review_url?: string | null
          status?: string
          status_history?: Json | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "removal_requests_billing_history_id_fkey"
            columns: ["billing_history_id"]
            isOneToOne: false
            referencedRelation: "billing_history"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "review_cases_billing_history_id_fkey"
            columns: ["billing_history_id"]
            isOneToOne: false
            referencedRelation: "billing_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_cases_removal_request_id_fkey"
            columns: ["removal_request_id"]
            isOneToOne: false
            referencedRelation: "removal_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          created_at: string
          email_address: string
          first_name: string
          id: string
          last_name: string
          message: string
          phone_number: string | null
        }
        Insert: {
          created_at?: string
          email_address: string
          first_name: string
          id?: string
          last_name: string
          message: string
          phone_number?: string | null
        }
        Update: {
          created_at?: string
          email_address?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          phone_number?: string | null
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
      user_messages: {
        Row: {
          chat_type: string | null
          content: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
          session_id: string
          user_id: string
        }
        Insert: {
          chat_type?: string | null
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
          session_id: string
          user_id: string
        }
        Update: {
          chat_type?: string | null
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      business_profiles: {
        Row: {
          id: string
          user_id: string | null
          google_place_id: string
          google_cid: string | null
          name: string
          address: string | null
          rating: number | null
          total_reviews: number | null
          primary_type: string | null
          phone: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          google_place_id: string
          google_cid?: string | null
          name: string
          address?: string | null
          rating?: number | null
          total_reviews?: number | null
          primary_type?: string | null
          phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          google_place_id?: string
          google_cid?: string | null
          name?: string
          address?: string | null
          rating?: number | null
          total_reviews?: number | null
          primary_type?: string | null
          phone?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      business_scans: {
        Row: {
          id: string
          business_profile_id: string
          user_id: string
          dataforseo_task_id: string | null
          status: string
          reviews_found: number
          threats_found: number
          scan_type: string
          started_at: string
          completed_at: string | null
          reviews_json: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_profile_id: string
          user_id: string
          dataforseo_task_id?: string | null
          status?: string
          reviews_found?: number
          threats_found?: number
          scan_type?: string
          started_at?: string
          completed_at?: string | null
          reviews_json?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_profile_id?: string
          user_id?: string
          dataforseo_task_id?: string | null
          status?: string
          reviews_found?: number
          threats_found?: number
          scan_type?: string
          started_at?: string
          completed_at?: string | null
          reviews_json?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_scans_business_profile_id_fkey"
            columns: ["business_profile_id"]
            isOneToOne: false
            referencedRelation: "business_profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      scanned_reviews: {
        Row: {
          id: string
          scan_id: string
          dataforseo_review_id: string | null
          review_text: string | null
          original_review_text: string | null
          reviewer_name: string | null
          reviewer_profile_url: string | null
          reviewer_image_url: string | null
          reviewer_reviews_count: number | null
          reviewer_photos_count: number | null
          reviewer_is_local_guide: boolean
          rating: number | null
          review_url: string | null
          review_timestamp: string | null
          time_ago: string | null
          owner_answer: string | null
          owner_timestamp: string | null
          images: Json | null
          review_highlights: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          scan_id: string
          dataforseo_review_id?: string | null
          review_text?: string | null
          original_review_text?: string | null
          reviewer_name?: string | null
          reviewer_profile_url?: string | null
          reviewer_image_url?: string | null
          reviewer_reviews_count?: number | null
          reviewer_photos_count?: number | null
          reviewer_is_local_guide?: boolean
          rating?: number | null
          review_url?: string | null
          review_timestamp?: string | null
          time_ago?: string | null
          owner_answer?: string | null
          owner_timestamp?: string | null
          images?: Json | null
          review_highlights?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          scan_id?: string
          dataforseo_review_id?: string | null
          review_text?: string | null
          original_review_text?: string | null
          reviewer_name?: string | null
          reviewer_profile_url?: string | null
          reviewer_image_url?: string | null
          reviewer_reviews_count?: number | null
          reviewer_photos_count?: number | null
          reviewer_is_local_guide?: boolean
          rating?: number | null
          review_url?: string | null
          review_timestamp?: string | null
          time_ago?: string | null
          owner_answer?: string | null
          owner_timestamp?: string | null
          images?: Json | null
          review_highlights?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scanned_reviews_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "business_scans"
            referencedColumns: ["id"]
          }
        ]
      }
      review_threat_analysis: {
        Row: {
          id: string
          scanned_review_id: string
          violation_type: string
          confidence_score: number
          policy_citation: string | null
          removal_ground: string | null
          ai_explanation: string | null
          is_threat: boolean
          analyzed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          scanned_review_id: string
          violation_type: string
          confidence_score: number
          policy_citation?: string | null
          removal_ground?: string | null
          ai_explanation?: string | null
          is_threat?: boolean
          analyzed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          scanned_review_id?: string
          violation_type?: string
          confidence_score?: number
          policy_citation?: string | null
          removal_ground?: string | null
          ai_explanation?: string | null
          is_threat?: boolean
          analyzed_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_threat_analysis_scanned_review_id_fkey"
            columns: ["scanned_review_id"]
            isOneToOne: true
            referencedRelation: "scanned_reviews"
            referencedColumns: ["id"]
          }
        ]
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
