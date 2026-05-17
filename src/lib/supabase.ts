import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check your environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

/**
 * SQL SCHEMA FOR SUPABASE:
 * 
 * create table bookings (
 *   id uuid default uuid_generate_v4() primary key,
 *   created_at timestamp with time zone default timezone('utc'::text, now()) not null,
 *   user_id uuid references auth.users not null,
 *   pnr text not null,
 *   "from" text not null,
 *   "to" text not null,
 *   date text not null,
 *   time text not null,
 *   seat text not null,
 *   status text not null,
 *   type text not null,
 *   price numeric not null
 * );
 * 
 * -- Enable Row Level Security
 * alter table bookings enable row level security;
 * 
 * -- Create Policy
 * create policy "Users can only see their own bookings" 
 *   on bookings for select 
 *   using (auth.uid() = user_id);
 * 
 * create policy "Users can insert their own bookings" 
 *   on bookings for insert 
 *   with check (auth.uid() = user_id);
 * 
 * create policy "Users can delete their own bookings" 
 *   on bookings for delete 
 *   using (auth.uid() = user_id);
 */
