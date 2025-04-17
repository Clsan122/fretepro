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
      chat_messages: {
        Row: {
          created_at: string | null
          freight_id: string | null
          id: string
          message: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          freight_id?: string | null
          id?: string
          message: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          freight_id?: string | null
          id?: string
          message?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_freight"
            columns: ["freight_id"]
            isOneToOne: false
            referencedRelation: "freight_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_freight"
            columns: ["freight_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_receiver"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_ratings: {
        Row: {
          carrier_id: string
          comment: string | null
          created_at: string | null
          driver_id: string
          id: string
          rating: number
        }
        Insert: {
          carrier_id: string
          comment?: string | null
          created_at?: string | null
          driver_id: string
          id?: string
          rating: number
        }
        Update: {
          carrier_id?: string
          comment?: string | null
          created_at?: string | null
          driver_id?: string
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_carrier"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      favorite_drivers: {
        Row: {
          carrier_id: string
          created_at: string | null
          driver_id: string
          id: string
        }
        Insert: {
          carrier_id: string
          created_at?: string | null
          driver_id: string
          id?: string
        }
        Update: {
          carrier_id?: string
          created_at?: string | null
          driver_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_carrier"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      freight_payments: {
        Row: {
          created_at: string | null
          freight_id: string
          id: string
          payment_method: string
          payment_terms: string
          toll_included: boolean
        }
        Insert: {
          created_at?: string | null
          freight_id: string
          id?: string
          payment_method: string
          payment_terms: string
          toll_included?: boolean
        }
        Update: {
          created_at?: string | null
          freight_id?: string
          id?: string
          payment_method?: string
          payment_terms?: string
          toll_included?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "fk_freight"
            columns: ["freight_id"]
            isOneToOne: false
            referencedRelation: "freight_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_freight"
            columns: ["freight_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          city: string | null
          cnpj: string | null
          company_logo: string | null
          company_name: string | null
          cpf: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          pix_key: string | null
          state: string | null
          updated_at: string | null
          user_type: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          cnpj?: string | null
          company_logo?: string | null
          company_name?: string | null
          cpf?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          pix_key?: string | null
          state?: string | null
          updated_at?: string | null
          user_type?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          city?: string | null
          cnpj?: string | null
          company_logo?: string | null
          company_name?: string | null
          cpf?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          pix_key?: string | null
          state?: string | null
          updated_at?: string | null
          user_type?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          client: string | null
          created_at: string | null
          date: string
          description: string
          destination: string
          id: string
          image_proofs: string[] | null
          location_latitude: number | null
          location_longitude: number | null
          notes: string | null
          origin: string | null
          other_values: number | null
          packages: number | null
          payment_id: string | null
          priority: boolean | null
          receiver: string | null
          recipient: string | null
          sender: string | null
          service_value: number | null
          user_id: string
          value: number
          vehicle_id: string | null
          weight: number | null
        }
        Insert: {
          client?: string | null
          created_at?: string | null
          date?: string
          description: string
          destination: string
          id?: string
          image_proofs?: string[] | null
          location_latitude?: number | null
          location_longitude?: number | null
          notes?: string | null
          origin?: string | null
          other_values?: number | null
          packages?: number | null
          payment_id?: string | null
          priority?: boolean | null
          receiver?: string | null
          recipient?: string | null
          sender?: string | null
          service_value?: number | null
          user_id: string
          value: number
          vehicle_id?: string | null
          weight?: number | null
        }
        Update: {
          client?: string | null
          created_at?: string | null
          date?: string
          description?: string
          destination?: string
          id?: string
          image_proofs?: string[] | null
          location_latitude?: number | null
          location_longitude?: number | null
          notes?: string | null
          origin?: string | null
          other_values?: number | null
          packages?: number | null
          payment_id?: string | null
          priority?: boolean | null
          receiver?: string | null
          recipient?: string | null
          sender?: string | null
          service_value?: number | null
          user_id?: string
          value?: number
          vehicle_id?: string | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "freight_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          antt: string | null
          cargo_type: string
          created_at: string | null
          id: string
          license_plate: string
          trailer_plate1: string | null
          trailer_plate2: string | null
          user_id: string
          vehicle_type: string
        }
        Insert: {
          antt?: string | null
          cargo_type: string
          created_at?: string | null
          id?: string
          license_plate: string
          trailer_plate1?: string | null
          trailer_plate2?: string | null
          user_id: string
          vehicle_type: string
        }
        Update: {
          antt?: string | null
          cargo_type?: string
          created_at?: string | null
          id?: string
          license_plate?: string
          trailer_plate1?: string | null
          trailer_plate2?: string | null
          user_id?: string
          vehicle_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      freight_details: {
        Row: {
          client: string | null
          created_at: string | null
          date: string | null
          description: string | null
          destination: string | null
          id: string | null
          image_proofs: string[] | null
          location_latitude: number | null
          location_longitude: number | null
          notes: string | null
          origin: string | null
          other_values: number | null
          packages: number | null
          payment_id: string | null
          payment_method: string | null
          payment_terms: string | null
          priority: boolean | null
          receiver: string | null
          recipient: string | null
          sender: string | null
          service_value: number | null
          toll_included: boolean | null
          user_id: string | null
          value: number | null
          vehicle_id: string | null
          weight: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "freight_payments"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
