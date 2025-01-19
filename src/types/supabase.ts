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
          // Add type definitions based on your schema
        }
        Insert: {
          // Add insert types
        }
        Update: {
          // Add update types
        }
      }
      // Add other tables...
    }
  }
}