export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      guides: {
        Row: {
          id: string;
          name: string;
          profile_image: string | null;
          is_approved: boolean;
          created_at: string;
          countries: string | null;
          description: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          profile_image?: string | null;
          is_approved?: boolean;
          created_at?: string;
          countries?: string | null;
          description?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          profile_image?: string | null;
          is_approved?: boolean;
          created_at?: string;
          countries?: string | null;
          description?: string | null;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};