export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'student' | 'coordinator' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'student' | 'coordinator' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'student' | 'coordinator' | 'admin'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedSource: "auth"
          }
        ]
      }
      student_profiles: {
        Row: {
          user_id: string
          name: string
          college: string
          year: number
          phone: string
        }
        Insert: {
          user_id: string
          name: string
          college: string
          year: number
          phone: string
        }
        Update: {
          user_id?: string
          name?: string
          college?: string
          year?: number
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedSource: "public"
          }
        ]
      }
      clubs: {
        Row: {
          id: string
          name: string
          description: string
          logo_url: string
          eligibility_criteria: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          logo_url: string
          eligibility_criteria: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          logo_url?: string
          eligibility_criteria?: string
        }
        Relationships: []
      }
      coordinator_profiles: {
        Row: {
          user_id: string
          name: string
          college: string
          phone: string
          photo_url: string
          club_id: string
          occupation: 'president' | 'vice_president' | 'treasurer' | 'member'
          proof_of_occupation_url: string
          status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          user_id: string
          name: string
          college: string
          phone: string
          photo_url: string
          club_id: string
          occupation: 'president' | 'vice_president' | 'treasurer' | 'member'
          proof_of_occupation_url: string
          status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          user_id?: string
          name?: string
          college?: string
          phone?: string
          photo_url?: string
          club_id?: string
          occupation?: 'president' | 'vice_president' | 'treasurer' | 'member'
          proof_of_occupation_url?: string
          status?: 'pending' | 'approved' | 'rejected'
        }
        Relationships: [
          {
            foreignKeyName: "coordinator_profiles_club_id_fkey"
            columns: ["club_id"]
            referencedRelation: "clubs"
            referencedSource: "public"
          },
          {
            foreignKeyName: "coordinator_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedSource: "public"
          }
        ]
      }
      events: {
        Row: {
          id: string
          club_id: string
          title: string
          description: string
          prize_pool: number
          team_size: number
          mode: 'online' | 'offline'
          status: 'upcoming' | 'ongoing' | 'past'
          start_date: string
          end_date: string
          registration_deadline: string
          highlights_text: string | null
          photo_urls: string[]
          created_by: string
        }
        Insert: {
          id?: string
          club_id: string
          title: string
          description: string
          prize_pool?: number
          team_size?: number
          mode: 'online' | 'offline'
          status?: 'upcoming' | 'ongoing' | 'past'
          start_date: string
          end_date: string
          registration_deadline: string
          highlights_text?: string | null
          photo_urls?: string[]
          created_by: string
        }
        Update: {
          id?: string
          club_id?: string
          title?: string
          description?: string
          prize_pool?: number
          team_size?: number
          mode?: 'online' | 'offline'
          status?: 'upcoming' | 'ongoing' | 'past'
          start_date?: string
          end_date?: string
          registration_deadline?: string
          highlights_text?: string | null
          photo_urls?: string[]
          created_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_club_id_fkey"
            columns: ["club_id"]
            referencedRelation: "clubs"
            referencedSource: "public"
          },
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "coordinator_profiles"
            referencedSource: "public"
          }
        ]
      }
      registrations: {
        Row: {
          id: string
          event_id: string
          student_user_id: string
          registered_at: string
        }
        Insert: {
          id?: string
          event_id: string
          student_user_id: string
          registered_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          student_user_id?: string
          registered_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            referencedRelation: "events"
            referencedSource: "public"
          },
          {
            foreignKeyName: "registrations_student_user_id_fkey"
            columns: ["student_user_id"]
            referencedRelation: "student_profiles"
            referencedSource: "public"
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          club_id: string
          type: 'income' | 'expense'
          amount: number
          description: string
          date: string
          created_by: string
        }
        Insert: {
          id?: string
          club_id: string
          type: 'income' | 'expense'
          amount: number
          description: string
          date?: string
          created_by: string
        }
        Update: {
          id?: string
          club_id?: string
          type?: 'income' | 'expense'
          amount?: number
          description?: string
          date?: string
          created_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_club_id_fkey"
            columns: ["club_id"]
            referencedRelation: "clubs"
            referencedSource: "public"
          },
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "coordinator_profiles"
            referencedSource: "public"
          }
        ]
      }
      admin_audit_log: {
        Row: {
          id: string
          admin_id: string | null
          action: string
          target_table: string
          target_id: string
          details: Json
          timestamp: string
        }
        Insert: {
          id?: string
          admin_id?: string | null
          action: string
          target_table: string
          target_id: string
          details: Json
          timestamp?: string
        }
        Update: {
          id?: string
          admin_id?: string | null
          action?: string
          target_table?: string
          target_id?: string
          details?: Json
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_id_fkey"
            columns: ["admin_id"]
            referencedRelation: "profiles"
            referencedSource: "public"
          }
        ]
      }
    }
  }
}
