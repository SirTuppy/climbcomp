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
      competitions: {
        Row: {
          id: string
          name: string
          type: 'Boulder' | 'Lead' | 'Speed'
          start_date: string
          end_date: string
          status: 'Draft' | 'Registration' | 'Active' | 'Complete'
          scoring_rules: Json
          custom_fields: Json
          is_template: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'Boulder' | 'Lead' | 'Speed'
          start_date: string
          end_date: string
          status?: 'Draft' | 'Registration' | 'Active' | 'Complete'
          scoring_rules?: Json
          custom_fields?: Json
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'Boulder' | 'Lead' | 'Speed'
          start_date?: string
          end_date?: string
          status?: 'Draft' | 'Registration' | 'Active' | 'Complete'
          scoring_rules?: Json
          custom_fields?: Json
          is_template?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      competition_rounds: {
        Row: {
          id: string
          competition_id: string
          name: string
          order: number
          scoring_rules: Json
          status: 'Hidden' | 'Registration' | 'Active' | 'Complete'
          max_problems: number | null
          qualification_rules: Json
          created_at: string
        }
        Insert: {
          id?: string
          competition_id: string
          name: string
          order: number
          scoring_rules?: Json
          status?: 'Hidden' | 'Registration' | 'Active' | 'Complete'
          max_problems?: number | null
          qualification_rules?: Json
          created_at?: string
        }
        Update: {
          id?: string
          competition_id?: string
          name?: string
          order?: number
          scoring_rules?: Json
          status?: 'Hidden' | 'Registration' | 'Active' | 'Complete'
          max_problems?: number | null
          qualification_rules?: Json
          created_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          roles: string[]
          created_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          roles?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          roles?: string[]
          created_at?: string
        }
      }
      // Add other tables as needed...
    }
  }
}