/**
 * RANDOMLY — Supabase database types
 *
 * TypeScript definitions for your Supabase schema.
 * Update these types to match your actual database tables and columns.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      /** The favorites table - stores user's saved activities */
      favorites: {
        Row: {
          /** Unique identifier */
          id: string;
          /** The Supabase auth user ID */
          user_id: string;
          /** The activity ID from the activities data */
          activity_id: string;
          /** When the favorite was created */
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_id?: string;
          created_at?: string;
        };
      };
    };
  };
}