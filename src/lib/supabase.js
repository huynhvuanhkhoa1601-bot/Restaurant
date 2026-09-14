import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mrsrxndkhnzqjhgwamki.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc3J4bmRraG56cWpoZ3dhbWtpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNTI2MzAsImV4cCI6MjEwNDkyODYzMH0.V86ru3sqoC-xYDDF6N-F6jfcAhufxgCsM_ohEvT2Hic';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
