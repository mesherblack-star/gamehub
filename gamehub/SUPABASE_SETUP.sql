-- ============================================================
-- GAMEHUB - Supabase Database Setup
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── PROFILES TABLE ──
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── GAMES TABLE ──
CREATE TABLE IF NOT EXISTS public.games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  developer TEXT,
  release_date DATE,
  cover_url TEXT,
  platforms TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── RATINGS TABLE ──
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating_value INTEGER NOT NULL CHECK (rating_value >= 1 AND rating_value <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, user_id)
);

-- ── COMMENTS TABLE ──
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 2 AND 1000),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── BOOKMARKS TABLE ──
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, user_id)
);

-- ── INDEXES ──
CREATE INDEX IF NOT EXISTS idx_games_genre ON public.games(genre);
CREATE INDEX IF NOT EXISTS idx_games_release_date ON public.games(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_game_id ON public.ratings(game_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_game_id ON public.comments(game_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);

-- ── AUTO-CREATE PROFILE ON SIGNUP ──
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Public profiles readable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- GAMES policies
CREATE POLICY "Games publicly readable" ON public.games FOR SELECT USING (true);
-- Only admins insert games (via Supabase dashboard or service key)

-- RATINGS policies
CREATE POLICY "Ratings publicly readable" ON public.ratings FOR SELECT USING (true);
CREATE POLICY "Users can insert own ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ratings" ON public.ratings FOR DELETE USING (auth.uid() = user_id);

-- COMMENTS policies
CREATE POLICY "Comments publicly readable" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- BOOKMARKS policies
CREATE POLICY "Users can see own bookmarks" ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('game-covers', 'game-covers', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Game covers publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'game-covers');
CREATE POLICY "Avatars publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own avatars" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- SAMPLE DATA
-- ============================================================
INSERT INTO public.games (title, description, genre, developer, release_date, cover_url, platforms)
VALUES
(
  'Cyber Nexus 2077',
  'An open-world action RPG set in a dystopian future megacity. Play as V, a mercenary outlaw going after a one-of-a-kind implant that is the key to immortality. Features an expansive world with deep character customization, hundreds of quests, and multiple story paths.',
  'RPG',
  'NightDrive Studios',
  '2023-06-15',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80',
  ARRAY['PC', 'PS5', 'Xbox']
),
(
  'Shadow Legends: Reborn',
  'A dark fantasy action-adventure where you battle ancient demons as the last surviving shadow hunter. Features brutal combat, intricate lore, and a world of deep moral choices that shape the story.',
  'Action',
  'DarkBlade Games',
  '2024-01-20',
  'https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=600&q=80',
  ARRAY['PC', 'PS5']
),
(
  'Galaxy Commander',
  'Lead your fleet across the stars in this epic space strategy game. Build colonies, research technologies, forge alliances, and wage war across hundreds of procedurally generated star systems.',
  'Strategy',
  'Stellar Forge Interactive',
  '2023-09-10',
  'https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=600&q=80',
  ARRAY['PC']
),
(
  'Velocity Rush 24',
  'The ultimate street racing experience with 200+ cars, 50 tracks across 10 cities, and a deep career mode. Featuring real-world physics, full customization, and thrilling online multiplayer.',
  'Sports',
  'Turbine Entertainment',
  '2024-03-05',
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  ARRAY['PC', 'PS5', 'Xbox']
),
(
  'Haunted Asylum',
  'Survive the night in an abandoned psychiatric hospital plagued by vengeful spirits. A first-person psychological horror experience that will test your sanity with procedural scares and atmospheric dread.',
  'Horror',
  'Phantom Dev',
  '2023-10-31',
  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&q=80',
  ARRAY['PC', 'PS5']
),
(
  'Legends of Aethoria',
  'Embark on an epic 100-hour RPG adventure through a beautifully crafted fantasy world. Build your party, master magic systems, and uncover a conspiracy that threatens all of existence.',
  'RPG',
  'Aether Studios',
  '2022-11-18',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
  ARRAY['PC', 'PS5', 'Xbox', 'Switch']
),
(
  'Neon Striker',
  'A fast-paced cyberpunk brawler with fluid combo combat, stylish visuals, and a pounding electronic soundtrack. Take down crime syndicates across a neon-drenched metropolis.',
  'Action',
  'ByteKick Studios',
  '2024-02-14',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&q=80',
  ARRAY['PC', 'Switch']
),
(
  'Ocean Deep',
  'Explore the mysteries of the deep ocean in this survival adventure. Dive to crushing depths, discover alien sea creatures, build underwater bases, and uncover ancient secrets.',
  'Adventure',
  'Blue Abyss Games',
  '2023-07-22',
  'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  ARRAY['PC', 'PS5']
),
(
  'Warfront Legacy',
  'A gripping WW2 tactical shooter with authentic weapons, realistic ballistics, and squad-based mechanics. Fight across Europe in a campaign spanning 20 missions.',
  'Action',
  'Iron Front Games',
  '2023-11-11',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80',
  ARRAY['PC', 'PS5', 'Xbox']
),
(
  'Pixel Kingdom',
  'A charming retro-style city builder where you grow a tiny village into a sprawling medieval kingdom. Features cozy gameplay, quirky characters, and endless customization.',
  'Strategy',
  'RetroPixel Co',
  '2024-04-01',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
  ARRAY['PC', 'Switch', 'Mobile']
),
(
  'Frost Protocol',
  'A tense sci-fi survival horror set on a research station in Pluto orbit. Manage resources, repair systems, and outwit an evolving alien threat that learns from your strategies.',
  'Horror',
  'Cryo Labs',
  '2024-01-05',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80',
  ARRAY['PC']
),
(
  'Champions Arena',
  'The ultimate sports management game. Scout talent, train athletes, build facilities, and lead your team to championship glory across dozens of sports disciplines.',
  'Sports',
  'Victory League Studios',
  '2023-08-15',
  'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&q=80',
  ARRAY['PC', 'PS5', 'Xbox']
);

