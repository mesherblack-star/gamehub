// ============================================
// supabaseClient.js - Supabase Configuration
// ============================================

// ⚠️ IMPORTANT: Replace these with your actual Supabase credentials
// Get them from: https://supabase.com/dashboard → Project Settings → API
const SUPABASE_URL = window.ENV?.SUPABASE_URL || 'https://whtbfgwuodcljqcnospl.supabase.co';
const SUPABASE_ANON_KEY = window.ENV?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndodGJmZ3d1b2RjbGpxY25vc3BsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDE2NDksImV4cCI6MjA4ODExNzY0OX0.DqeO88kod0w5M76xbT3ei11Gy2-OWzoS1M-busQ-ENI';

// Import Supabase from CDN (loaded via script tag in HTML)
const { createClient } = supabase;

// Initialize client
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Export for use in other modules
window.supabaseClient = supabaseClient;

// ── Database Table Names ──
const TABLES = {
  GAMES: 'games',
  RATINGS: 'ratings',
  COMMENTS: 'comments',
  PROFILES: 'profiles',
  BOOKMARKS: 'bookmarks'
};

window.TABLES = TABLES;

// ── Storage Buckets ──
const BUCKETS = {
  COVERS: 'game-covers',
  AVATARS: 'avatars'
};

window.BUCKETS = BUCKETS;

console.log('✅ Supabase client initialized');
