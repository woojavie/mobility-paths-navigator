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
      accessibility_issues: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          latitude: number
          longitude: number
          reported_by: string | null
          start_date: string | null
          title: string
          type: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          latitude: number
          longitude: number
          reported_by?: string | null
          start_date?: string | null
          title: string
          type: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          latitude?: number
          longitude?: number
          reported_by?: string | null
          start_date?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      accessibility_points: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_operational: boolean | null
          latitude: number
          longitude: number
          name: string
          reported_by: string | null
          type: string
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_operational?: boolean | null
          latitude: number
          longitude: number
          name: string
          reported_by?: string | null
          type: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_operational?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          reported_by?: string | null
          type?: string
          updated_at?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      accessible_routes: {
        Row: {
          avoids_construction: boolean | null
          avoids_stairs: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          end_point: Json
          has_elevator: boolean | null
          id: string
          name: string
          path_coordinates: Json
          rating: number | null
          start_point: Json
          updated_at: string | null
          verified: boolean | null
          wheelchair_accessible: boolean | null
        }
        Insert: {
          avoids_construction?: boolean | null
          avoids_stairs?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_point: Json
          has_elevator?: boolean | null
          id?: string
          name: string
          path_coordinates: Json
          rating?: number | null
          start_point: Json
          updated_at?: string | null
          verified?: boolean | null
          wheelchair_accessible?: boolean | null
        }
        Update: {
          avoids_construction?: boolean | null
          avoids_stairs?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_point?: Json
          has_elevator?: boolean | null
          id?: string
          name?: string
          path_coordinates?: Json
          rating?: number | null
          start_point?: Json
          updated_at?: string | null
          verified?: boolean | null
          wheelchair_accessible?: boolean | null
        }
        Relationships: []
      }
      discussion_likes: {
        Row: {
          created_at: string | null
          discussion_id: string | null
          id: string
          reply_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          reply_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          reply_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      discussion_replies: {
        Row: {
          author: string
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          likes_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          likes_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          likes_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      discussions: {
        Row: {
          author: string
          content: string
          created_at: string | null
          id: string
          likes_count: number | null
          replies_count: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author: string
          content: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          replies_count?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string | null
          id?: string
          likes_count?: number | null
          replies_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          mobility_preferences: Json | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          mobility_preferences?: Json | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          mobility_preferences?: Json | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      review_likes: {
        Row: {
          created_at: string | null
          id: string
          review_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          review_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          review_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          author: string
          created_at: string | null
          id: string
          location: string
          place: string
          rating: number
          text: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          author: string
          created_at?: string | null
          id?: string
          location: string
          place: string
          rating: number
          text: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          author?: string
          created_at?: string | null
          id?: string
          location?: string
          place?: string
          rating?: number
          text?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
