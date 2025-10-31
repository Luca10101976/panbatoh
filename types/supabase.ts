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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      contact_requests: {
        Row: {
          created_at: string | null
          guide_id: string | null
          id: string
          message: string
          sender_email: string
          sender_name: string
        }
        Insert: {
          created_at?: string | null
          guide_id?: string | null
          id?: string
          message: string
          sender_email: string
          sender_name: string
        }
        Update: {
          created_at?: string | null
          guide_id?: string | null
          id?: string
          message?: string
          sender_email?: string
          sender_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "my_guide_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "public_published_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_photos: {
        Row: {
          approved: boolean | null
          created_at: string | null
          guide_id: string | null
          id: number
          photo_url: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          guide_id?: string | null
          id?: never
          photo_url: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          guide_id?: string | null
          id?: never
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "my_guide_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "public_published_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      guides: {
        Row: {
          approved: boolean | null
          destination: string | null
          created_at: string | null
          description: string | null
          email: string | null
          experience: string | null
          id: string
          is_admin: boolean | null
          is_approved: boolean | null
          languages: string | null
          name: string | null
          photograph: string | null
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          destination?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          experience?: string | null
          id?: string
          is_admin?: boolean | null
          is_approved?: boolean | null
          languages?: string | null
          name?: string | null
          photograph?: string | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          destination?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          experience?: string | null
          id?: string
          is_admin?: boolean | null
          is_approved?: boolean | null
          languages?: string | null
          name?: string | null
          photograph?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      itineraries: {
        Row: {
          approved: boolean | null
          created_at: string | null
          description: string | null
          guide_id: string | null
          guide_id_backup: string | null
          id: number
          title: string
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          description?: string | null
          guide_id?: string | null
          guide_id_backup?: string | null
          id?: number
          title: string
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          description?: string | null
          guide_id?: string | null
          guide_id_backup?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      itinerary_day_photos: {
        Row: {
          approved: boolean | null
          caption: string | null
          created_at: string | null
          day_id: number | null
          id: number
          photo_url: string
        }
        Insert: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string | null
          day_id?: number | null
          id?: number
          photo_url: string
        }
        Update: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string | null
          day_id?: number | null
          id?: number
          photo_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_day_photos_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_days: {
        Row: {
          created_at: string | null
          day_number: number
          description: string | null
          id: number
          itinerary_id: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          day_number: number
          description?: string | null
          id?: number
          itinerary_id?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          day_number?: number
          description?: string | null
          id?: number
          itinerary_id?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_days_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "admin_itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_days_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_days_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "my_itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          approved: boolean | null
          content: string
          created_at: string | null
          guide_id: string | null
          id: number
          rating: number | null
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          content: string
          created_at?: string | null
          guide_id?: string | null
          id?: never
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          content?: string
          created_at?: string | null
          guide_id?: string | null
          id?: never
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string | null
          id: string
          is_admin: boolean | null
        }
        Insert: {
          email?: string | null
          id: string
          is_admin?: boolean | null
        }
        Update: {
          email?: string | null
          id?: string
          is_admin?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      admin_guide_photos: {
        Row: {
          approved: boolean | null
          created_at: string | null
          guide_id: string | null
          id: number | null
          photo_url: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          guide_id?: string | null
          id?: number | null
          photo_url?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          guide_id?: string | null
          id?: number | null
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "my_guide_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "public_published_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_guides: {
        Row: {
          approved: boolean | null
          destination: string | null
          created_at: string | null
          description: string | null
          email: string | null
          experience: string | null
          id: string | null
          is_approved: boolean | null
          languages: string | null
          name: string | null
          photograph: string | null
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          destination?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          experience?: string | null
          id?: string | null
          is_approved?: boolean | null
          languages?: string | null
          name?: string | null
          photograph?: string | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          destination?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          experience?: string | null
          id?: string | null
          is_approved?: boolean | null
          languages?: string | null
          name?: string | null
          photograph?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_itineraries: {
        Row: {
          approved: boolean | null
          created_at: string | null
          description: string | null
          guide_id: string | null
          guide_id_backup: string | null
          id: number | null
          title: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          description?: string | null
          guide_id?: string | null
          guide_id_backup?: string | null
          id?: number | null
          title?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          description?: string | null
          guide_id?: string | null
          guide_id_backup?: string | null
          id?: number | null
          title?: string | null
        }
        Relationships: []
      }
      admin_itinerary_day_photos: {
        Row: {
          approved: boolean | null
          caption: string | null
          created_at: string | null
          day_id: number | null
          id: number | null
          photo_url: string | null
        }
        Insert: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string | null
          day_id?: number | null
          id?: number | null
          photo_url?: string | null
        }
        Update: {
          approved?: boolean | null
          caption?: string | null
          created_at?: string | null
          day_id?: number | null
          id?: number | null
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_day_photos_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_messages: {
        Row: {
          created_at: string | null
          guide_id: string | null
          id: string | null
          message: string | null
          sender_email: string | null
          sender_name: string | null
        }
        Insert: {
          created_at?: string | null
          guide_id?: string | null
          id?: string | null
          message?: string | null
          sender_email?: string | null
          sender_name?: string | null
        }
        Update: {
          created_at?: string | null
          guide_id?: string | null
          id?: string | null
          message?: string | null
          sender_email?: string | null
          sender_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "my_guide_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "public_published_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_reviews: {
        Row: {
          approved: boolean | null
          content: string | null
          created_at: string | null
          guide_id: string | null
          id: number | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          content?: string | null
          created_at?: string | null
          guide_id?: string | null
          id?: number | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          content?: string | null
          created_at?: string | null
          guide_id?: string | null
          id?: number | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      my_contact_requests: {
        Row: {
          created_at: string | null
          guide_id: string | null
          id: string | null
          message: string | null
          sender_email: string | null
          sender_name: string | null
        }
        Insert: {
          created_at?: string | null
          guide_id?: string | null
          id?: string | null
          message?: string | null
          sender_email?: string | null
          sender_name?: string | null
        }
        Update: {
          created_at?: string | null
          guide_id?: string | null
          id?: string | null
          message?: string | null
          sender_email?: string | null
          sender_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "my_guide_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "public_published_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      my_guide_photos: {
        Row: {
          approved: boolean | null
          created_at: string | null
          guide_id: string | null
          id: number | null
          photo_url: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          guide_id?: string | null
          id?: number | null
          photo_url?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          guide_id?: string | null
          id?: number | null
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "my_guide_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "public_published_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      my_guide_profile: {
        Row: {
          approved: boolean | null
          destination: string | null
          created_at: string | null
          description: string | null
          email: string | null
          experience: string | null
          id: string | null
          is_approved: boolean | null
          languages: string | null
          name: string | null
          photograph: string | null
          user_id: string | null
        }
        Insert: {
          approved?: boolean | null
          destination?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          experience?: string | null
          id?: string | null
          is_approved?: boolean | null
          languages?: string | null
          name?: string | null
          photograph?: string | null
          user_id?: string | null
        }
        Update: {
          approved?: boolean | null
          destination?: string | null
          created_at?: string | null
          description?: string | null
          email?: string | null
          experience?: string | null
          id?: string | null
          is_approved?: boolean | null
          languages?: string | null
          name?: string | null
          photograph?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      my_itineraries: {
        Row: {
          approved: boolean | null
          created_at: string | null
          description: string | null
          guide_id: string | null
          guide_id_backup: string | null
          id: number | null
          title: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          description?: string | null
          guide_id?: string | null
          guide_id_backup?: string | null
          id?: number | null
          title?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          description?: string | null
          guide_id?: string | null
          guide_id_backup?: string | null
          id?: number | null
          title?: string | null
        }
        Relationships: []
      }
      my_messages: {
        Row: {
          created_at: string | null
          guide_id: string | null
          id: string | null
          message: string | null
          sender_email: string | null
          sender_name: string | null
        }
        Insert: {
          created_at?: string | null
          guide_id?: string | null
          id?: string | null
          message?: string | null
          sender_email?: string | null
          sender_name?: string | null
        }
        Update: {
          created_at?: string | null
          guide_id?: string | null
          id?: string | null
          message?: string | null
          sender_email?: string | null
          sender_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "my_guide_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "public_published_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      my_reviews: {
        Row: {
          approved: boolean | null
          content: string | null
          created_at: string | null
          guide_id: string | null
          id: number | null
          rating: number | null
          user_id: string | null
        }
        Relationships: []
      }
      public_guide_photos: {
        Row: {
          approved: boolean | null
          created_at: string | null
          guide_id: string | null
          id: number | null
          photo_url: string | null
        }
        Insert: {
          approved?: boolean | null
          created_at?: string | null
          guide_id?: string | null
          id?: number | null
          photo_url?: string | null
        }
        Update: {
          approved?: boolean | null
          created_at?: string | null
          guide_id?: string | null
          id?: number | null
          photo_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "admin_guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guides"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "my_guide_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guide_photos_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "public_published_guides"
            referencedColumns: ["id"]
          },
        ]
      }
      public_itinerary_day_photos: {
        Row: {
          caption: string | null
          created_at: string | null
          day_id: number | null
          id: number | null
          photo_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_day_photos_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "itinerary_days"
            referencedColumns: ["id"]
          },
        ]
      }
      public_published_guides: {
        Row: {
          approved: boolean | null
          destination: string | null
          created_at: string | null
          description: string | null
          experience: string | null
          id: string | null
          languages: string | null
          name: string | null
          photograph: string | null
        }
        Insert: {
          approved?: boolean | null
          destination?: string | null
          created_at?: string | null
          description?: string | null
          experience?: string | null
          id?: string | null
          languages?: string | null
          name?: string | null
          photograph?: string | null
        }
        Update: {
          approved?: boolean | null
          destination?: string | null
          created_at?: string | null
          description?: string | null
          experience?: string | null
          id?: string | null
          languages?: string | null
          name?: string | null
          photograph?: string | null
        }
        Relationships: []
      }
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
