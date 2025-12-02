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
      attendance: {
        Row: {
          attendance_id: number
          class_id: number
          date: string
          member_id: number
        }
        Insert: {
          attendance_id?: number
          class_id: number
          date: string
          member_id: number
        }
        Update: {
          attendance_id?: number
          class_id?: number
          date?: string
          member_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_fill_rate"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["member_id"]
          },
        ]
      }
      class: {
        Row: {
          class_id: number
          class_name: string
          max_capacity: number
          schedule_time: string
          trainer_id: number
        }
        Insert: {
          class_id?: number
          class_name: string
          max_capacity: number
          schedule_time: string
          trainer_id: number
        }
        Update: {
          class_id?: number
          class_name?: string
          max_capacity?: number
          schedule_time?: string
          trainer_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainer"
            referencedColumns: ["trainer_id"]
          },
        ]
      }
      group_trainer: {
        Row: {
          max_classes: number
          trainer_id: number
        }
        Insert: {
          max_classes: number
          trainer_id: number
        }
        Update: {
          max_classes?: number
          trainer_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_trainer_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: true
            referencedRelation: "trainer"
            referencedColumns: ["trainer_id"]
          },
        ]
      }
      member: {
        Row: {
          email: string
          first: string
          join_date: string
          last: string
          member_id: number
          membership_id: number
          middle: string | null
          phone_number: string
          trainer_id: number | null
        }
        Insert: {
          email: string
          first: string
          join_date: string
          last: string
          member_id?: number
          membership_id: number
          middle?: string | null
          phone_number: string
          trainer_id?: number | null
        }
        Update: {
          email?: string
          first?: string
          join_date?: string
          last?: string
          member_id?: number
          membership_id?: number
          middle?: string | null
          phone_number?: string
          trainer_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "member_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "membership"
            referencedColumns: ["plan_id"]
          },
          {
            foreignKeyName: "member_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "trainer"
            referencedColumns: ["trainer_id"]
          },
        ]
      }
      membership: {
        Row: {
          duration_months: number
          plan_id: number
          plan_name: string
        }
        Insert: {
          duration_months: number
          plan_id?: number
          plan_name: string
        }
        Update: {
          duration_months?: number
          plan_id?: number
          plan_name?: string
        }
        Relationships: []
      }
      personal_trainer: {
        Row: {
          max_members: number
          trainer_id: number
        }
        Insert: {
          max_members: number
          trainer_id: number
        }
        Update: {
          max_members?: number
          trainer_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "personal_trainer_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: true
            referencedRelation: "trainer"
            referencedColumns: ["trainer_id"]
          },
        ]
      }
      takeclass: {
        Row: {
          class_id: number
          member_id: number
        }
        Insert: {
          class_id: number
          member_id: number
        }
        Update: {
          class_id?: number
          member_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "takeclass_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "takeclass_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_fill_rate"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "takeclass_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["member_id"]
          },
        ]
      }
      teach: {
        Row: {
          class_id: number
          trainer_id: number
        }
        Insert: {
          class_id: number
          trainer_id: number
        }
        Update: {
          class_id?: number
          trainer_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "teach_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "teach_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "class_fill_rate"
            referencedColumns: ["class_id"]
          },
          {
            foreignKeyName: "teach_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "group_trainer"
            referencedColumns: ["trainer_id"]
          },
        ]
      }
      train: {
        Row: {
          member_id: number
          trainer_id: number
        }
        Insert: {
          member_id: number
          trainer_id: number
        }
        Update: {
          member_id?: number
          trainer_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "train_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "train_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "personal_trainer"
            referencedColumns: ["trainer_id"]
          },
        ]
      }
      trainer: {
        Row: {
          email: string
          first: string
          hourly_rate: number
          join_date: string
          last: string
          middle: string | null
          phone_number: string
          rating: number | null
          trainer_id: number
        }
        Insert: {
          email: string
          first: string
          hourly_rate: number
          join_date: string
          last: string
          middle?: string | null
          phone_number: string
          rating?: number | null
          trainer_id?: number
        }
        Update: {
          email?: string
          first?: string
          hourly_rate?: number
          join_date?: string
          last?: string
          middle?: string | null
          phone_number?: string
          rating?: number | null
          trainer_id?: number
        }
        Relationships: []
      }
    }
    Views: {
      class_fill_rate: {
        Row: {
          class_id: number | null
          class_name: string | null
          enrolled: number | null
          fill_percent: number | null
          max_capacity: number | null
          schedule_time: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      member_schedule: {
        Args: { p_member_id: number }
        Returns: {
          class_id: number
          class_name: string
          member_first: string
          member_id: number
          member_last: string
          schedule_time: string
          trainer_first: string
          trainer_id: number
          trainer_last: string
        }[]
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
