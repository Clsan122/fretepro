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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          city: string
          cnpj: string | null
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_orders: {
        Row: {
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "collection_orders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          additional_docs_urls: Json | null
          address: string | null
          approval_notes: string | null
          approved_at: string | null
          approved_by: string | null
          city: string | null
          cnpj: string
          created_at: string | null
          email: string
          id: string
          license_document_url: string | null
          logo_url: string | null
          monthly_freight_limit: number | null
          name: string
          phone: string
          primary_color: string | null
          registration_document_url: string | null
          rejected_at: string | null
          rejection_reason: string | null
          settings: Json | null
          state: string | null
          status: Database["public"]["Enums"]["company_status"]
          subscription_expires_at: string | null
          subscription_plan:
            | Database["public"]["Enums"]["subscription_plan_type"]
            | null
          subscription_status: string | null
          trial_ends_at: string | null
          updated_at: string | null
          user_limit: number | null
          zip_code: string | null
        }
        Insert: {
          additional_docs_urls?: Json | null
          address?: string | null
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          city?: string | null
          cnpj: string
          created_at?: string | null
          email: string
          id?: string
          license_document_url?: string | null
          logo_url?: string | null
          monthly_freight_limit?: number | null
          name: string
          phone: string
          primary_color?: string | null
          registration_document_url?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          settings?: Json | null
          state?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan_type"]
            | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_limit?: number | null
          zip_code?: string | null
        }
        Update: {
          additional_docs_urls?: Json | null
          address?: string | null
          approval_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          city?: string | null
          cnpj?: string
          created_at?: string | null
          email?: string
          id?: string
          license_document_url?: string | null
          logo_url?: string | null
          monthly_freight_limit?: number | null
          name?: string
          phone?: string
          primary_color?: string | null
          registration_document_url?: string | null
          rejected_at?: string | null
          rejection_reason?: string | null
          settings?: Json | null
          state?: string | null
          status?: Database["public"]["Enums"]["company_status"]
          subscription_expires_at?: string | null
          subscription_plan?:
            | Database["public"]["Enums"]["subscription_plan_type"]
            | null
          subscription_status?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
          user_limit?: number | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_ratings: {
        Row: {
          assignment_id: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          driver_id: string
          id: string
          rating: number
          review: string | null
        }
        Insert: {
          assignment_id?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          driver_id: string
          id?: string
          rating: number
          review?: string | null
        }
        Update: {
          assignment_id?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          driver_id?: string
          id?: string
          rating?: number
          review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_ratings_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "freight_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_ratings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_ratings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_ratings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_ratings: {
        Row: {
          assignment_id: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          driver_id: string
          id: string
          rating: number
          review: string | null
        }
        Insert: {
          assignment_id?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          driver_id: string
          id?: string
          rating: number
          review?: string | null
        }
        Update: {
          assignment_id?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          driver_id?: string
          id?: string
          rating?: number
          review?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "driver_ratings_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "freight_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_ratings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_ratings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_ratings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          address: string | null
          antt_code: string
          body_type: string
          company_id: string | null
          cpf: string
          created_at: string
          id: string
          is_independent: boolean | null
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
          company_id?: string | null
          cpf: string
          created_at?: string
          id?: string
          is_independent?: boolean | null
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
          company_id?: string | null
          cpf?: string
          created_at?: string
          id?: string
          is_independent?: boolean | null
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
        Relationships: [
          {
            foreignKeyName: "drivers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      freight_assignments: {
        Row: {
          assigned_price: number
          bid_id: string | null
          company_id: string
          completed_at: string | null
          created_at: string | null
          delivery_proof: string | null
          driver_id: string
          freight_id: string
          id: string
          pickup_proof: string | null
          rating_company: number | null
          rating_driver: number | null
          review_company: string | null
          review_driver: string | null
          started_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_price: number
          bid_id?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string | null
          delivery_proof?: string | null
          driver_id: string
          freight_id: string
          id?: string
          pickup_proof?: string | null
          rating_company?: number | null
          rating_driver?: number | null
          review_company?: string | null
          review_driver?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_price?: number
          bid_id?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string | null
          delivery_proof?: string | null
          driver_id?: string
          freight_id?: string
          id?: string
          pickup_proof?: string | null
          rating_company?: number | null
          rating_driver?: number | null
          review_company?: string | null
          review_driver?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freight_assignments_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "freight_bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_assignments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_assignments_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_assignments_freight_id_fkey"
            columns: ["freight_id"]
            isOneToOne: false
            referencedRelation: "marketplace_freights"
            referencedColumns: ["id"]
          },
        ]
      }
      freight_bids: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          created_at: string | null
          driver_id: string
          estimated_delivery_date: string | null
          estimated_pickup_date: string | null
          freight_id: string
          id: string
          message: string | null
          proposed_price: number
          rejected_at: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["bid_status"] | null
          updated_at: string | null
          user_id: string
          withdrawn_at: string | null
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string | null
          driver_id: string
          estimated_delivery_date?: string | null
          estimated_pickup_date?: string | null
          freight_id: string
          id?: string
          message?: string | null
          proposed_price: number
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["bid_status"] | null
          updated_at?: string | null
          user_id: string
          withdrawn_at?: string | null
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          created_at?: string | null
          driver_id?: string
          estimated_delivery_date?: string | null
          estimated_pickup_date?: string | null
          freight_id?: string
          id?: string
          message?: string | null
          proposed_price?: number
          rejected_at?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["bid_status"] | null
          updated_at?: string | null
          user_id?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freight_bids_accepted_by_fkey"
            columns: ["accepted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_bids_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_bids_freight_id_fkey"
            columns: ["freight_id"]
            isOneToOne: false
            referencedRelation: "marketplace_freights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_bids_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      freight_tracking: {
        Row: {
          assignment_id: string
          created_at: string | null
          driver_id: string
          heading: number | null
          id: string
          latitude: number
          longitude: number
          notes: string | null
          speed: number | null
          status: string | null
        }
        Insert: {
          assignment_id: string
          created_at?: string | null
          driver_id: string
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          notes?: string | null
          speed?: number | null
          status?: string | null
        }
        Update: {
          assignment_id?: string
          created_at?: string | null
          driver_id?: string
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          notes?: string | null
          speed?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "freight_tracking_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "freight_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freight_tracking_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
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
          company_id: string | null
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
          visibility: string | null
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
          company_id?: string | null
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
          visibility?: string | null
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
          company_id?: string | null
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
          visibility?: string | null
          volumes?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "freights_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_freights: {
        Row: {
          bids_count: number | null
          body_type: string | null
          cargo_description: string | null
          cargo_type: string
          company_id: string
          contact_email: string | null
          contact_name: string
          contact_phone: string
          created_at: string | null
          delivery_deadline: string | null
          destination_address: string | null
          destination_city: string
          destination_state: string
          dimensions: string | null
          distance: number | null
          expires_at: string | null
          id: string
          origin_address: string | null
          origin_city: string
          origin_state: string
          pickup_date: string | null
          posted_by: string
          price_negotiable: boolean | null
          requires_insurance: boolean | null
          requires_tracking: boolean | null
          special_requirements: string | null
          status: Database["public"]["Enums"]["freight_status"]
          suggested_price: number | null
          updated_at: string | null
          vehicle_type: string | null
          views_count: number | null
          visibility: string | null
          volumes: number | null
          weight: number | null
        }
        Insert: {
          bids_count?: number | null
          body_type?: string | null
          cargo_description?: string | null
          cargo_type: string
          company_id: string
          contact_email?: string | null
          contact_name: string
          contact_phone: string
          created_at?: string | null
          delivery_deadline?: string | null
          destination_address?: string | null
          destination_city: string
          destination_state: string
          dimensions?: string | null
          distance?: number | null
          expires_at?: string | null
          id?: string
          origin_address?: string | null
          origin_city: string
          origin_state: string
          pickup_date?: string | null
          posted_by: string
          price_negotiable?: boolean | null
          requires_insurance?: boolean | null
          requires_tracking?: boolean | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["freight_status"]
          suggested_price?: number | null
          updated_at?: string | null
          vehicle_type?: string | null
          views_count?: number | null
          visibility?: string | null
          volumes?: number | null
          weight?: number | null
        }
        Update: {
          bids_count?: number | null
          body_type?: string | null
          cargo_description?: string | null
          cargo_type?: string
          company_id?: string
          contact_email?: string | null
          contact_name?: string
          contact_phone?: string
          created_at?: string | null
          delivery_deadline?: string | null
          destination_address?: string | null
          destination_city?: string
          destination_state?: string
          dimensions?: string | null
          distance?: number | null
          expires_at?: string | null
          id?: string
          origin_address?: string | null
          origin_city?: string
          origin_state?: string
          pickup_date?: string | null
          posted_by?: string
          price_negotiable?: boolean | null
          requires_insurance?: boolean | null
          requires_tracking?: boolean | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["freight_status"]
          suggested_price?: number | null
          updated_at?: string | null
          vehicle_type?: string | null
          views_count?: number | null
          visibility?: string | null
          volumes?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_freights_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_freights_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          freight_id: string | null
          id: string
          message: string
          read: boolean | null
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          freight_id?: string | null
          id?: string
          message: string
          read?: boolean | null
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          freight_id?: string | null
          id?: string
          message?: string
          read?: boolean | null
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_freight_id_fkey"
            columns: ["freight_id"]
            isOneToOne: false
            referencedRelation: "marketplace_freights"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string | null
          data: Json | null
          id: string
          message: string
          read: boolean | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message: string
          read?: boolean | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string
          read?: boolean | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
          company_id: string | null
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
          company_id?: string | null
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
          company_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_history: {
        Row: {
          amount_paid: number | null
          billing_period: string | null
          canceled_at: string | null
          company_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          plan_id: string | null
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          started_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          billing_period?: string | null
          canceled_at?: string | null
          company_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          plan_id?: string | null
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          started_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          billing_period?: string | null
          canceled_at?: string | null
          company_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          plan_id?: string | null
          plan_type?: Database["public"]["Enums"]["subscription_plan_type"]
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscription_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscription_history_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          features: Json | null
          has_api_access: boolean | null
          has_custom_branding: boolean | null
          has_marketplace_access: boolean | null
          has_priority_support: boolean | null
          id: string
          monthly_freight_limit: number | null
          name: string
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          price_monthly: number
          price_yearly: number
          storage_limit_gb: number | null
          updated_at: string | null
          user_limit: number | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          has_api_access?: boolean | null
          has_custom_branding?: boolean | null
          has_marketplace_access?: boolean | null
          has_priority_support?: boolean | null
          id?: string
          monthly_freight_limit?: number | null
          name: string
          plan_type: Database["public"]["Enums"]["subscription_plan_type"]
          price_monthly?: number
          price_yearly?: number
          storage_limit_gb?: number | null
          updated_at?: string | null
          user_limit?: number | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          features?: Json | null
          has_api_access?: boolean | null
          has_custom_branding?: boolean | null
          has_marketplace_access?: boolean | null
          has_priority_support?: boolean | null
          id?: string
          monthly_freight_limit?: number | null
          name?: string
          plan_type?: Database["public"]["Enums"]["subscription_plan_type"]
          price_monthly?: number
          price_yearly?: number
          storage_limit_gb?: number | null
          updated_at?: string | null
          user_limit?: number | null
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
      user_roles: {
        Row: {
          company_id: string | null
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      user_has_company_access: {
        Args: { _company_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "superadmin"
        | "company_admin"
        | "company_user"
        | "driver"
        | "shipper"
      bid_status: "pending" | "accepted" | "rejected" | "withdrawn"
      company_status:
        | "pending_approval"
        | "active"
        | "suspended"
        | "rejected"
        | "canceled"
      freight_status:
        | "draft"
        | "pending_approval"
        | "open"
        | "in_negotiation"
        | "assigned"
        | "in_transit"
        | "completed"
        | "canceled"
      subscription_plan_type: "free" | "basic" | "pro" | "enterprise"
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
      app_role: [
        "superadmin",
        "company_admin",
        "company_user",
        "driver",
        "shipper",
      ],
      bid_status: ["pending", "accepted", "rejected", "withdrawn"],
      company_status: [
        "pending_approval",
        "active",
        "suspended",
        "rejected",
        "canceled",
      ],
      freight_status: [
        "draft",
        "pending_approval",
        "open",
        "in_negotiation",
        "assigned",
        "in_transit",
        "completed",
        "canceled",
      ],
      subscription_plan_type: ["free", "basic", "pro", "enterprise"],
    },
  },
} as const
