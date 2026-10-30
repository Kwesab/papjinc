export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string | null
          created_at: string
          date: string | null
          description: string | null
          id: string
          image_url: string | null
          link: string | null
          organization: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          organization?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          link?: string | null
          organization?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_activity_log: {
        Row: {
          action: string
          actor: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          previous_value: Json | null
          status: string
          suggested_value: Json | null
        }
        Insert: {
          action: string
          actor?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          previous_value?: Json | null
          status?: string
          suggested_value?: Json | null
        }
        Update: {
          action?: string
          actor?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          previous_value?: Json | null
          status?: string
          suggested_value?: Json | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: string | null
          event_type: string
          id: string
          path: string | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          id?: string
          path?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          id?: string
          path?: string | null
        }
        Relationships: []
      }
      availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_active: boolean
          slot_minutes: number
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time?: string
          id?: string
          is_active?: boolean
          slot_minutes?: number
          start_time?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_active?: boolean
          slot_minutes?: number
          start_time?: string
        }
        Relationships: []
      }
      blackout_dates: {
        Row: {
          created_at: string
          date: string
          id: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          reason?: string | null
        }
        Relationships: []
      }
      certifications: {
        Row: {
          category: string | null
          created_at: string
          credential_id: string | null
          credential_url: string | null
          description: string | null
          expiry_date: string | null
          featured: boolean
          id: string
          image_url: string | null
          issue_date: string | null
          issuing_organization: string | null
          pdf_url: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuing_organization?: string | null
          pdf_url?: string | null
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          credential_id?: string | null
          credential_url?: string | null
          description?: string | null
          expiry_date?: string | null
          featured?: boolean
          id?: string
          image_url?: string | null
          issue_date?: string | null
          issuing_organization?: string | null
          pdf_url?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      consultation_bookings: {
        Row: {
          additional_notes: string | null
          admin_notes: string | null
          consultation_type: string | null
          created_at: string
          description: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          preferred_date: string | null
          preferred_time: string | null
          project_name: string | null
          service_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          admin_notes?: string | null
          consultation_type?: string | null
          created_at?: string
          description?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          project_name?: string | null
          service_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          admin_notes?: string | null
          consultation_type?: string | null
          created_at?: string
          description?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          preferred_date?: string | null
          preferred_time?: string | null
          project_name?: string | null
          service_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "consultation_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cv_settings: {
        Row: {
          created_at: string
          download_count: number
          id: string
          included_experience_ids: string[]
          included_project_ids: string[]
          included_skill_ids: string[]
          is_default: boolean
          is_published: boolean
          name: string
          summary: string | null
          template: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          download_count?: number
          id?: string
          included_experience_ids?: string[]
          included_project_ids?: string[]
          included_skill_ids?: string[]
          is_default?: boolean
          is_published?: boolean
          name?: string
          summary?: string | null
          template?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          download_count?: number
          id?: string
          included_experience_ids?: string[]
          included_project_ids?: string[]
          included_skill_ids?: string[]
          is_default?: boolean
          is_published?: boolean
          name?: string
          summary?: string | null
          template?: string
          updated_at?: string
        }
        Relationships: []
      }
      download_entitlements: {
        Row: {
          created_at: string
          downloads_used: number
          expires_at: string
          id: string
          max_downloads: number
          order_id: string
          product_id: string
          token: string
        }
        Insert: {
          created_at?: string
          downloads_used?: number
          expires_at: string
          id?: string
          max_downloads?: number
          order_id: string
          product_id: string
          token: string
        }
        Update: {
          created_at?: string
          downloads_used?: number
          expires_at?: string
          id?: string
          max_downloads?: number
          order_id?: string
          product_id?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "download_entitlements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "download_entitlements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          certificate_url: string | null
          created_at: string
          degree: string | null
          description: string | null
          end_date: string | null
          featured: boolean
          id: string
          institution: string
          is_current: boolean
          logo_url: string | null
          program: string | null
          sort_order: number
          start_date: string | null
          updated_at: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          featured?: boolean
          id?: string
          institution: string
          is_current?: boolean
          logo_url?: string | null
          program?: string | null
          sort_order?: number
          start_date?: string | null
          updated_at?: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          degree?: string | null
          description?: string | null
          end_date?: string | null
          featured?: boolean
          id?: string
          institution?: string
          is_current?: boolean
          logo_url?: string | null
          program?: string | null
          sort_order?: number
          start_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          achievements: string[]
          created_at: string
          description: string | null
          employment_type: string | null
          end_date: string | null
          id: string
          is_current: boolean
          job_title: string
          location: string | null
          logo_url: string | null
          organization: string
          responsibilities: string[]
          sort_order: number
          start_date: string | null
          technologies: string[]
          updated_at: string
        }
        Insert: {
          achievements?: string[]
          created_at?: string
          description?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          job_title: string
          location?: string | null
          logo_url?: string | null
          organization: string
          responsibilities?: string[]
          sort_order?: number
          start_date?: string | null
          technologies?: string[]
          updated_at?: string
        }
        Update: {
          achievements?: string[]
          created_at?: string
          description?: string | null
          employment_type?: string | null
          end_date?: string | null
          id?: string
          is_current?: boolean
          job_title?: string
          location?: string | null
          logo_url?: string | null
          organization?: string
          responsibilities?: string[]
          sort_order?: number
          start_date?: string | null
          technologies?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      media: {
        Row: {
          bucket: string
          created_at: string
          file_name: string
          file_size: number | null
          file_type: string | null
          id: string
          path: string
          url: string | null
        }
        Insert: {
          bucket?: string
          created_at?: string
          file_name: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          path: string
          url?: string | null
        }
        Update: {
          bucket?: string
          created_at?: string
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          path?: string
          url?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          download_count: number
          id: string
          last_download_at: string | null
          order_status: string
          payment_reference: string | null
          payment_status: string
          product_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          download_count?: number
          id?: string
          last_download_at?: string | null
          order_status?: string
          payment_reference?: string | null
          payment_status?: string
          product_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          download_count?: number
          id?: string
          last_download_at?: string | null
          order_status?: string
          payment_reference?: string | null
          payment_status?: string
          product_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_files: {
        Row: {
          bucket: string
          created_at: string
          file_name: string | null
          file_size: number | null
          id: string
          path: string
          product_id: string
        }
        Insert: {
          bucket?: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          path: string
          product_id: string
        }
        Update: {
          bucket?: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          id?: string
          path?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_files_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          availability_status: string
          biography: string
          career_goals: string
          created_at: string
          current_focus: string
          display_name: string
          email: string
          full_name: string
          hero_description: string
          hero_headline: string
          id: string
          location: string
          phone: string
          professional_journey: string
          professional_summary: string
          professional_title: string
          profile_image_url: string | null
          short_bio: string
          updated_at: string
          website: string
          whatsapp: string
        }
        Insert: {
          availability_status?: string
          biography?: string
          career_goals?: string
          created_at?: string
          current_focus?: string
          display_name?: string
          email?: string
          full_name?: string
          hero_description?: string
          hero_headline?: string
          id?: string
          location?: string
          phone?: string
          professional_journey?: string
          professional_summary?: string
          professional_title?: string
          profile_image_url?: string | null
          short_bio?: string
          updated_at?: string
          website?: string
          whatsapp?: string
        }
        Update: {
          availability_status?: string
          biography?: string
          career_goals?: string
          created_at?: string
          current_focus?: string
          display_name?: string
          email?: string
          full_name?: string
          hero_description?: string
          hero_headline?: string
          id?: string
          location?: string
          phone?: string
          professional_journey?: string
          professional_summary?: string
          professional_title?: string
          profile_image_url?: string | null
          short_bio?: string
          updated_at?: string
          website?: string
          whatsapp?: string
        }
        Relationships: []
      }
      project_media: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          media_type: string
          project_id: string
          sort_order: number
          url: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          media_type?: string
          project_id: string
          sort_order?: number
          url: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          media_type?: string
          project_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_media_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          architecture: string | null
          category: string
          challenges: string | null
          created_at: string
          documentation_url: string | null
          featured: boolean
          features: string[]
          full_description: string | null
          github_url: string | null
          id: string
          lessons_learned: string | null
          live_url: string | null
          problem: string | null
          published: boolean
          published_at: string | null
          results: string | null
          short_description: string | null
          slug: string
          solution: string | null
          sort_order: number
          technologies: string[]
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          architecture?: string | null
          category?: string
          challenges?: string | null
          created_at?: string
          documentation_url?: string | null
          featured?: boolean
          features?: string[]
          full_description?: string | null
          github_url?: string | null
          id?: string
          lessons_learned?: string | null
          live_url?: string | null
          problem?: string | null
          published?: boolean
          published_at?: string | null
          results?: string | null
          short_description?: string | null
          slug: string
          solution?: string | null
          sort_order?: number
          technologies?: string[]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          architecture?: string | null
          category?: string
          challenges?: string | null
          created_at?: string
          documentation_url?: string | null
          featured?: boolean
          features?: string[]
          full_description?: string | null
          github_url?: string | null
          id?: string
          lessons_learned?: string | null
          live_url?: string | null
          problem?: string | null
          published?: boolean
          published_at?: string | null
          results?: string | null
          short_description?: string | null
          slug?: string
          solution?: string | null
          sort_order?: number
          technologies?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          currency: string
          features: string[]
          full_description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          short_description: string | null
          sort_order: number
          starting_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          features?: string[]
          full_description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          short_description?: string | null
          sort_order?: number
          starting_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          features?: string[]
          full_description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          short_description?: string | null
          sort_order?: number
          starting_price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          is_public: boolean
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          is_public?: boolean
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          is_public?: boolean
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          featured: boolean
          icon: string | null
          id: string
          name: string
          proficiency: string | null
          sort_order: number
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          category?: string
          created_at?: string
          featured?: boolean
          icon?: string | null
          id?: string
          name: string
          proficiency?: string | null
          sort_order?: number
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          featured?: boolean
          icon?: string | null
          id?: string
          name?: string
          proficiency?: string | null
          sort_order?: number
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          is_active: boolean
          platform: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          platform: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          platform?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      store_products: {
        Row: {
          created_at: string
          currency: string
          demo_url: string | null
          documentation: string | null
          featured: boolean
          features: string[]
          full_description: string | null
          gallery: string[]
          github_url: string | null
          id: string
          license_terms: string | null
          license_type: string
          name: string
          price: number
          published: boolean
          requirements: string[]
          short_description: string | null
          slug: string
          technologies: string[]
          thumbnail_url: string | null
          updated_at: string
          version: string | null
          view_count: number
        }
        Insert: {
          created_at?: string
          currency?: string
          demo_url?: string | null
          documentation?: string | null
          featured?: boolean
          features?: string[]
          full_description?: string | null
          gallery?: string[]
          github_url?: string | null
          id?: string
          license_terms?: string | null
          license_type?: string
          name: string
          price?: number
          published?: boolean
          requirements?: string[]
          short_description?: string | null
          slug: string
          technologies?: string[]
          thumbnail_url?: string | null
          updated_at?: string
          version?: string | null
          view_count?: number
        }
        Update: {
          created_at?: string
          currency?: string
          demo_url?: string | null
          documentation?: string | null
          featured?: boolean
          features?: string[]
          full_description?: string | null
          gallery?: string[]
          github_url?: string | null
          id?: string
          license_terms?: string | null
          license_type?: string
          name?: string
          price?: number
          published?: boolean
          requirements?: string[]
          short_description?: string | null
          slug?: string
          technologies?: string[]
          thumbnail_url?: string | null
          updated_at?: string
          version?: string | null
          view_count?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      claim_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
