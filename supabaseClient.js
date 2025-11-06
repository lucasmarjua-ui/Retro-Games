// supabaseClient.js  (module)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Sustituye por tus valores si son diferentes
const SUPABASE_URL = 'https://gowgclioxsdmgugmydmv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvd2djbGlveHNkbWd1Z215ZG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MzAwMjUsImV4cCI6MjA3ODAwNjAyNX0.tHXcV_Ks351TZBdfTCQbo0QQxumi8QUFlJLP8Vu8H2Y';

// crea el cliente y lo hace accesible globalmente
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// exportar no es necesario si lo ponemos en window, pero lo dejamos también
window.supabase = supabase;
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
