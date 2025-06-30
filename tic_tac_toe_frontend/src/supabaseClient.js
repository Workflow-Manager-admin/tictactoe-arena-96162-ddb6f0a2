import { createClient } from "@supabase/supabase-js";

// PUBLIC_INTERFACE
/**
 * Exports a configured supabase client, pulling values from .env.
 * To authenticate or manage users, use this client.
 *
 * Environment variables required:
 * - REACT_APP_SUPABASE_URL
 * - REACT_APP_SUPABASE_KEY
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || "https://sifshblvwjgyketwesog.supabase.co";
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZnNoYmx2d2pneWtldHdlc29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzMDE4NzksImV4cCI6MjA2Njg3Nzg3OX0.ZDxL8P5gYekwUnzWEsB2TZugTAwncNK_UJmL6cieUMw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

