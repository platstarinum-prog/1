import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Mood = 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious';

export interface DiaryEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  mood: Mood;
  created_at: string;
  updated_at: string;
}
