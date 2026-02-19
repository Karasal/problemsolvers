import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface LeadSubmission {
  name: string;
  email: string;
  phone?: string;
  business?: string;
  problem: string;
  created_at?: string;
}

export async function submitLead(lead: LeadSubmission) {
  const { data, error } = await supabase.from("leads").insert([lead]).select();

  if (error) throw error;
  return data;
}
