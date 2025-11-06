import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

export const supabase = createClient(
  "https://gowgclioxsdmgugmydmv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvd2djbGlveHNkbWd1Z215ZG12Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MzAwMjUsImV4cCI6MjA3ODAwNjAyNX0.tHXcV_Ks351TZBdfTCQbo0QQxumi8QUFlJLP8Vu8H2Y"
);

