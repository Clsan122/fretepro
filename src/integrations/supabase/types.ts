export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          city: string
          cnpj: string | null
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          logo: string | null
          name: string
          person_type: string
          phone: string | null
          state: string
          sync_id: string | null
          sync_version: number | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city: string
          cnpj?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo?: string | null
          name: string
          person_type: string
          phone?: string | null
          state: string
          sync_id?: string | null
          sync_version?: number | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          cnpj?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo?: string | null
          name?: string
          person_type?: string
          phone?: string | null
          state?: string
          sync_id?: string | null
          sync_version?: number | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      collection_orders: {
        Row: {
          company_logo: string
          created_at: string
          cubic_measurement: number
          destination_city: string
          destination_state: string
          driver_cpf: string | null
          driver_id: string | null
          driver_name: string | null
          id: string
          invoice_number: string
          issuer_id: string
          license_plate: string | null
          merchandise_value: number
          observations: string | null
          order_number: string
          origin_city: string
          origin_state: string
          receiver: string
          receiver_address: string
          recipient: string
          recipient_address: string
          sender: string
          sender_address: string
          sender_city: string | null
          sender_cnpj: string | null
          sender_state: string | null
          shipper: string | null
          shipper_address: string | null
          sync_id: string | null
          sync_version: number | null
          user_id: string
          volumes: number
          weight: number
        }
        Insert: {
          company_logo: string
          created_at?: string
          cubic_measurement: number
          destination_city: string
          destination_state: string
          driver_cpf?: string | null
          driver_id?: string | null
          driver_name?: string | null
          id?: string
          invoice_number: string
          issuer_id: string
          license_plate?: string | null
          merchandise_value: number
          observations?: string | null
          order_number: string
          origin_city: string
          origin_state: string
          receiver: string
          receiver_address: string
          recipient: string
          recipient_address: string
          sender: string
          sender_address: string
          sender_city?: string | null
          sender_cnpj?: string | null
          sender_state?: string | null
          shipper?: string | null
          shipper_address?: string | null
          sync_id?: string | null
          sync_version?: number | null
          user_id: string
          volumes: number
          weight: number
        }
        Update: {
          company_logo?: string
          created_at?: string
          cubic_measurement?: number
          destination_city?: string
          destination_state?: string
          driver_cpf?: string | null
          driver_id?: string | null
          driver_name?: string | null
          id?: string
          invoice_number?: string
          issuer_id?: string
          license_plate?: string | null
          merchandise_value?: number
          observations?: string | null
          order_number?: string
          origin_city?: string
          origin_state?: string
          receiver?: string
          receiver_address?: string
          recipient?: string
          recipient_address?: string
          sender?: string
          sender_address?: string
          sender_city?: string | null
          sender_cnpj?: string | null
          sender_state?: string | null
          shipper?: string | null
          shipper_address?: string | null
          sync_id?: string | null
          sync_version?: number | null
          user_id?: string
          volumes?: number
          weight?: number
        }
        Relationships: []
      }
      drivers: {
        Row: {
          address: string | null
          antt_code: string
          body_type: string
          cpf: string
          created_at: string
          id: string
          license_plate: string
          name: string
          phone: string
          sync_id: string | null
          sync_version: number | null
          trailer_plate: string | null
          updated_at: string
          user_id: string
          vehicle_model: string
          vehicle_type: string
          vehicle_year: string
        }
        Insert: {
          address?: string | null
          antt_code: string
          body_type: string
          cpf: string
          created_at?: string
          id?: string
          license_plate: string
          name: string
          phone: string
          sync_id?: string | null
          sync_version?: number | null
          trailer_plate?: string | null
          updated_at?: string
          user_id: string
          vehicle_model: string
          vehicle_type: string
          vehicle_year: string
        }
        Update: {
          address?: string | null
          antt_code?: string
          body_type?: string
          cpf?: string
          created_at?: string
          id?: string
          license_plate?: string
          name?: string
          phone?: string
          sync_id?: string | null
          sync_version?: number | null
          trailer_plate?: string | null
          updated_at?: string
          user_id?: string
          vehicle_model?: string
          vehicle_type?: string
          vehicle_year?: string
        }
        Relationships: []
      }
      freight_expenses: {
        Row: {
          category: string
          created_at: string
          date: string
          description: string
          freight_id: string
          id: string
          sync_id: string | null
          sync_version: number | null
          updated_at: string
          value: number
        }
        Insert: {
          category: string
          created_at?: string
          date: string
          description: string
          freight_id: string
          id?: string
          sync_id?: string | null
          sync_version?: number | null
          updated_at?: string
          value: number
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          description?: string
          freight_id?: string
          id?: string
          sync_id?: string | null
          sync_version?: number | null
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "freight_expenses_freight_id_fkey"
            columns: ["freight_id"]
            isOneToOne: false
            referencedRelation: "freights"
            referencedColumns: ["id"]
          },
        ]
      }
      freights: {
        Row: {
          accommodation_expenses: number | null
          arrival_date: string | null
          cargo_description: string | null
          cargo_type: string
          cargo_weight: number | null
          client_id: string
          created_at: string
          cubic_measurement: number | null
          daily_rate: number | null
          delivery_proof: string | null
          departure_date: string | null
          destination_city: string
          destination_state: string
          dimensions: string | null
          distance: number
          driver_id: string | null
          end_date: string | null
          freight_value: number
          fuel_expenses: number | null
          helper_expenses: number | null
          id: string
          meal_expenses: number | null
          observations: string | null
          origin_city: string
          origin_state: string
          other_costs: number | null
          payment_date: string | null
          payment_method: string | null
          payment_proof: string | null
          payment_status: string
          payment_term: string | null
          pix_key: string | null
          price: number
          proof_of_delivery_image: string | null
          requester_name: string | null
          start_date: string | null
          status: string
          sync_id: string | null
          sync_version: number | null
          third_party_driver_cost: number | null
          toll_costs: number | null
          toll_expenses: number | null
          total_value: number
          updated_at: string
          user_id: string
          vehicle_type: string | null
          volumes: number | null
          weight: number | null
        }
        Insert: {
          accommodation_expenses?: number | null
          arrival_date?: string | null
          cargo_description?: string | null
          cargo_type: string
          cargo_weight?: number | null
          client_id: string
          created_at?: string
          cubic_measurement?: number | null
          daily_rate?: number | null
          delivery_proof?: string | null
          departure_date?: string | null
          destination_city: string
          destination_state: string
          dimensions?: string | null
          distance: number
          driver_id?: string | null
          end_date?: string | null
          freight_value: number
          fuel_expenses?: number | null
          helper_expenses?: number | null
          id?: string
          meal_expenses?: number | null
          observations?: string | null
          origin_city: string
          origin_state: string
          other_costs?: number | null
          payment_date?: string | null
          payment_method?: string | null
          payment_proof?: string | null
          payment_status: string
          payment_term?: string | null
          pix_key?: string | null
          price: number
          proof_of_delivery_image?: string | null
          requester_name?: string | null
          start_date?: string | null
          status: string
          sync_id?: string | null
          sync_version?: number | null
          third_party_driver_cost?: number | null
          toll_costs?: number | null
          toll_expenses?: number | null
          total_value: number
          updated_at?: string
          user_id: string
          vehicle_type?: string | null
          volumes?: number | null
          weight?: number | null
        }
        Update: {
          accommodation_expenses?: number | null
          arrival_date?: string | null
          cargo_description?: string | null
          cargo_type?: string
          cargo_weight?: number | null
          client_id?: string
          created_at?: string
          cubic_measurement?: number | null
          daily_rate?: number | null
          delivery_proof?: string | null
          departure_date?: string | null
          destination_city?: string
          destination_state?: string
          dimensions?: string | null
          distance?: number
          driver_id?: string | null
          end_date?: string | null
          freight_value?: number
          fuel_expenses?: number | null
          helper_expenses?: number | null
          id?: string
          meal_expenses?: number | null
          observations?: string | null
          origin_city?: string
          origin_state?: string
          other_costs?: number | null
          payment_date?: string | null
          payment_method?: string | null
          payment_proof?: string | null
          payment_status?: string
          payment_term?: string | null
          pix_key?: string | null
          price?: number
          proof_of_delivery_image?: string | null
          requester_name?: string | null
          start_date?: string | null
          status?: string
          sync_id?: string | null
          sync_version?: number | null
          third_party_driver_cost?: number | null
          toll_costs?: number | null
          toll_expenses?: number | null
          total_value?: number
          updated_at?: string
          user_id?: string
          vehicle_type?: string | null
          volumes?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      measurements: {
        Row: {
          collection_order_id: string
          created_at: string
          height: number
          id: string
          length: number
          quantity: number
          sync_id: string | null
          sync_version: number | null
          width: number
        }
        Insert: {
          collection_order_id: string
          created_at?: string
          height: number
          id?: string
          length: number
          quantity: number
          sync_id?: string | null
          sync_version?: number | null
          width: number
        }
        Update: {
          collection_order_id?: string
          created_at?: string
          height?: number
          id?: string
          length?: number
          quantity?: number
          sync_id?: string | null
          sync_version?: number | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "measurements_collection_order_id_fkey"
            columns: ["collection_order_id"]
            isOneToOne: false
            referencedRelation: "collection_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bank_info: string | null
          city: string | null
          cnpj: string | null
          company_logo: string | null
          company_name: string | null
          cpf: string | null
          created_at: string | null
          created_devices_count: number | null
          default_company_settings: Json | null
          full_name: string | null
          id: string
          last_device_info: Json | null
          notification_settings: Json | null
          phone: string | null
          pix_key: string | null
          state: string | null
          ui_preferences: Json | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bank_info?: string | null
          city?: string | null
          cnpj?: string | null
          company_logo?: string | null
          company_name?: string | null
          cpf?: string | null
          created_at?: string | null
          created_devices_count?: number | null
          default_company_settings?: Json | null
          full_name?: string | null
          id: string
          last_device_info?: Json | null
          notification_settings?: Json | null
          phone?: string | null
          pix_key?: string | null
          state?: string | null
          ui_preferences?: Json | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bank_info?: string | null
          city?: string | null
          cnpj?: string | null
          company_logo?: string | null
          company_name?: string | null
          cpf?: string | null
          created_at?: string | null
          created_devices_count?: number | null
          default_company_settings?: Json | null
          full_name?: string | null
          id?: string
          last_device_info?: Json | null
          notification_settings?: Json | null
          phone?: string | null
          pix_key?: string | null
          state?: string | null
          ui_preferences?: Json | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      truck_loving_info: {
        Row: {
          antt_code: string | null
          body_type: string | null
          created_at: string | null
          id: string
          license_plate: string | null
          trailer_plate: string | null
          updated_at: string | null
          user_id: string | null
          vehicle_model: string | null
          vehicle_type: string | null
          vehicle_year: string | null
        }
        Insert: {
          antt_code?: string | null
          body_type?: string | null
          created_at?: string | null
          id?: string
          license_plate?: string | null
          trailer_plate?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_year?: string | null
        }
        Update: {
          antt_code?: string | null
          body_type?: string | null
          created_at?: string | null
          id?: string
          license_plate?: string | null
          trailer_plate?: string | null
          updated_at?: string | null
          user_id?: string | null
          vehicle_model?: string | null
          vehicle_type?: string | null
          vehicle_year?: string | null
        }
        Relationships: []
      }
      user_devices: {
        Row: {
          browser_info: Json | null
          created_at: string | null
          device_fingerprint: string
          device_name: string | null
          device_type: string | null
          id: string
          is_trusted: boolean | null
          last_accessed_at: string | null
          user_id: string
        }
        Insert: {
          browser_info?: Json | null
          created_at?: string | null
          device_fingerprint: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          is_trusted?: boolean | null
          last_accessed_at?: string | null
          user_id: string
        }
        Update: {
          browser_info?: Json | null
          created_at?: string | null
          device_fingerprint?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          is_trusted?: boolean | null
          last_accessed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_devices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          device_specific: boolean | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_fingerprint?: string | null
          device_specific?: boolean | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string | null
          device_specific?: boolean | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
