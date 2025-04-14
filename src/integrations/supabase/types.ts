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
      collections: {
        Row: {
          categories: Json | null
          collection_coordinates: Json | null
          collection_location_name: string | null
          collection_time: string | null
          created_at: string | null
          cubic_meters: string | null
          delivery_coordinates: Json | null
          delivery_location_name: string | null
          delivery_proof_image: string | null
          delivery_time: string | null
          driver_document: string | null
          driver_name: string | null
          driver_trailer_plate: string | null
          driver_vehicle_plate: string | null
          freight_value: string | null
          id: string
          receiver_address: string | null
          receiver_city: string | null
          receiver_contact_person: string | null
          receiver_name: string | null
          receiver_phone: string | null
          receiver_state: string | null
          receiver_zip_code: string | null
          recipient_address: string | null
          recipient_city: string | null
          recipient_contact_person: string | null
          recipient_name: string | null
          recipient_phone: string | null
          recipient_state: string | null
          recipient_zip_code: string | null
          sender_address: string | null
          sender_city: string | null
          sender_contact_person: string | null
          sender_name: string | null
          sender_phone: string | null
          sender_state: string | null
          sender_zip_code: string | null
          shipper_city: string | null
          shipper_contact_person: string | null
          shipper_phone: string | null
          shipper_state: string | null
          shipper_zip_code: string | null
          status: string
          updated_at: string | null
          user_id: string | null
          volume_count: string | null
          weight: string | null
        }
        Insert: {
          categories?: Json | null
          collection_coordinates?: Json | null
          collection_location_name?: string | null
          collection_time?: string | null
          created_at?: string | null
          cubic_meters?: string | null
          delivery_coordinates?: Json | null
          delivery_location_name?: string | null
          delivery_proof_image?: string | null
          delivery_time?: string | null
          driver_document?: string | null
          driver_name?: string | null
          driver_trailer_plate?: string | null
          driver_vehicle_plate?: string | null
          freight_value?: string | null
          id?: string
          receiver_address?: string | null
          receiver_city?: string | null
          receiver_contact_person?: string | null
          receiver_name?: string | null
          receiver_phone?: string | null
          receiver_state?: string | null
          receiver_zip_code?: string | null
          recipient_address?: string | null
          recipient_city?: string | null
          recipient_contact_person?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          recipient_state?: string | null
          recipient_zip_code?: string | null
          sender_address?: string | null
          sender_city?: string | null
          sender_contact_person?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          sender_state?: string | null
          sender_zip_code?: string | null
          shipper_city?: string | null
          shipper_contact_person?: string | null
          shipper_phone?: string | null
          shipper_state?: string | null
          shipper_zip_code?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          volume_count?: string | null
          weight?: string | null
        }
        Update: {
          categories?: Json | null
          collection_coordinates?: Json | null
          collection_location_name?: string | null
          collection_time?: string | null
          created_at?: string | null
          cubic_meters?: string | null
          delivery_coordinates?: Json | null
          delivery_location_name?: string | null
          delivery_proof_image?: string | null
          delivery_time?: string | null
          driver_document?: string | null
          driver_name?: string | null
          driver_trailer_plate?: string | null
          driver_vehicle_plate?: string | null
          freight_value?: string | null
          id?: string
          receiver_address?: string | null
          receiver_city?: string | null
          receiver_contact_person?: string | null
          receiver_name?: string | null
          receiver_phone?: string | null
          receiver_state?: string | null
          receiver_zip_code?: string | null
          recipient_address?: string | null
          recipient_city?: string | null
          recipient_contact_person?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          recipient_state?: string | null
          recipient_zip_code?: string | null
          sender_address?: string | null
          sender_city?: string | null
          sender_contact_person?: string | null
          sender_name?: string | null
          sender_phone?: string | null
          sender_state?: string | null
          sender_zip_code?: string | null
          shipper_city?: string | null
          shipper_contact_person?: string | null
          shipper_phone?: string | null
          shipper_state?: string | null
          shipper_zip_code?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          volume_count?: string | null
          weight?: string | null
        }
        Relationships: []
      }
      freight_quote_responses: {
        Row: {
          carrier_id: string
          created_at: string
          delivery_time: string
          id: string
          observations: string | null
          price: string
          quote_id: string
          status: string
          updated_at: string
        }
        Insert: {
          carrier_id: string
          created_at?: string
          delivery_time: string
          id?: string
          observations?: string | null
          price: string
          quote_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          carrier_id?: string
          created_at?: string
          delivery_time?: string
          id?: string
          observations?: string | null
          price?: string
          quote_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "freight_quote_responses_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "freight_quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      freight_quotes: {
        Row: {
          client_id: string | null
          created_at: string | null
          dangerous_cargo: boolean | null
          destination_address: string | null
          destination_city: string | null
          destination_company: string | null
          destination_state: string | null
          height: string | null
          id: string
          length: string | null
          open_vehicle: boolean | null
          origin_address: string | null
          origin_city: string | null
          origin_company: string | null
          origin_state: string | null
          sider_vehicle: boolean | null
          status: string
          updated_at: string | null
          volume_count: string | null
          weight: string | null
          width: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          dangerous_cargo?: boolean | null
          destination_address?: string | null
          destination_city?: string | null
          destination_company?: string | null
          destination_state?: string | null
          height?: string | null
          id?: string
          length?: string | null
          open_vehicle?: boolean | null
          origin_address?: string | null
          origin_city?: string | null
          origin_company?: string | null
          origin_state?: string | null
          sider_vehicle?: boolean | null
          status?: string
          updated_at?: string | null
          volume_count?: string | null
          weight?: string | null
          width?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          dangerous_cargo?: boolean | null
          destination_address?: string | null
          destination_city?: string | null
          destination_company?: string | null
          destination_state?: string | null
          height?: string | null
          id?: string
          length?: string | null
          open_vehicle?: boolean | null
          origin_address?: string | null
          origin_city?: string | null
          origin_company?: string | null
          origin_state?: string | null
          sider_vehicle?: boolean | null
          status?: string
          updated_at?: string | null
          volume_count?: string | null
          weight?: string | null
          width?: string | null
        }
        Relationships: []
      }
      occurrences: {
        Row: {
          collection_coordinates: Json | null
          collection_location_name: string | null
          collection_time: string | null
          created_at: string | null
          delivery_coordinates: Json | null
          delivery_location_name: string | null
          delivery_time: string | null
          description: string | null
          id: string
          proof_image: string | null
          receiver_name: string | null
          updated_at: string | null
        }
        Insert: {
          collection_coordinates?: Json | null
          collection_location_name?: string | null
          collection_time?: string | null
          created_at?: string | null
          delivery_coordinates?: Json | null
          delivery_location_name?: string | null
          delivery_time?: string | null
          description?: string | null
          id?: string
          proof_image?: string | null
          receiver_name?: string | null
          updated_at?: string | null
        }
        Update: {
          collection_coordinates?: Json | null
          collection_location_name?: string | null
          collection_time?: string | null
          created_at?: string | null
          delivery_coordinates?: Json | null
          delivery_location_name?: string | null
          delivery_time?: string | null
          description?: string | null
          id?: string
          proof_image?: string | null
          receiver_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: "client" | "driver" | "carrier"
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
    Enums: {
      user_role: ["client", "driver", "carrier"],
    },
  },
} as const
