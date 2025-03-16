import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pfkuqlkniiuiclkgfrri.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBma3VxbGtuaWl1aWNsa2dmcnJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxMDQ4MzgsImV4cCI6MjA1NzY4MDgzOH0.zAdDKs5lywB2GBOMWu961rwVvj1NKh3fjvIjahoXMT4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
