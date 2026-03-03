// ============================================
// games.js - Games CRUD Module
// ============================================

const Games = (() => {
  const PAGE_SIZE = 12;

  // ── Fetch All Games with Filters & Pagination ──
  const fetchGames = async ({ genre = null, minRating = null, year = null, page = 1, orderBy = 'created_at', ascending = false } = {}) => {
    let query = supabaseClient
      .from(TABLES.GAMES)
      .select(`*, ratings(rating_value)`, { count: 'exact' });

    if (genre) query = query.eq('genre', genre);
    if (year) query = query.gte('release_date', `${year}-01-01`).lte('release_date', `${year}-12-31`);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to).order(orderBy, { ascending });

    const { data, error, count } = await query;
    if (error) throw error;

    // Compute avg rating client-side
    const gamesWithRating = (data || []).map(g => ({
      ...g,
      avg_rating: g.ratings?.length
        ? +(g.ratings.reduce((s, r) => s + r.rating_value, 0) / g.ratings.length).toFixed(1)
        : 0,
      rating_count: g.ratings?.length || 0
    }));

    if (minRating) {
      return {
        data: gamesWithRating.filter(g => g.avg_rating >= minRating),
        count,
        totalPages: Math.ceil(count / PAGE_SIZE)
      };
    }

    return { data: gamesWithRating, count, totalPages: Math.ceil(count / PAGE_SIZE) };
  };

  // ── Fetch Single Game ──
  const fetchGame = async (id) => {
    const { data, error } = await supabaseClient
      .from(TABLES.GAMES)
      .select(`*, ratings(rating_value, user_id)`)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      avg_rating: data.ratings?.length
        ? +(data.ratings.reduce((s, r) => s + r.rating_value, 0) / data.ratings.length).toFixed(1)
        : 0,
      rating_count: data.ratings?.length || 0
    };
  };

  // ── Fetch New Releases ──
  const fetchNewReleases = async (limit = 8) => {
    const { data, error } = await supabaseClient
      .from(TABLES.GAMES)
      .select(`*, ratings(rating_value)`)
      .order('release_date', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data || []).map(g => ({
      ...g,
      avg_rating: g.ratings?.length
        ? +(g.ratings.reduce((s, r) => s + r.rating_value, 0) / g.ratings.length).toFixed(1) : 0,
      rating_count: g.ratings?.length || 0
    }));
  };

  // ── Fetch Top Rated ──
  const fetchTopRated = async (limit = 8) => {
    const { data, error } = await supabaseClient
      .from(TABLES.GAMES)
      .select(`*, ratings(rating_value)`)
      .limit(50);
    if (error) throw error;
    return (data || [])
      .map(g => ({
        ...g,
        avg_rating: g.ratings?.length
          ? +(g.ratings.reduce((s, r) => s + r.rating_value, 0) / g.ratings.length).toFixed(1) : 0,
        rating_count: g.ratings?.length || 0
      }))
      .filter(g => g.rating_count > 0)
      .sort((a, b) => b.avg_rating - a.avg_rating || b.rating_count - a.rating_count)
      .slice(0, limit);
  };

  // ── Fetch Trending (most rated recently) ──
  const fetchTrending = async (limit = 10) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabaseClient
      .from(TABLES.GAMES)
      .select(`*, ratings(rating_value, created_at)`)
      .limit(50);
    if (error) throw error;

    return (data || [])
      .map(g => {
        const recentRatings = (g.ratings || []).filter(r =>
          new Date(r.created_at) > thirtyDaysAgo);
        return {
          ...g,
          avg_rating: g.ratings?.length
            ? +(g.ratings.reduce((s, r) => s + r.rating_value, 0) / g.ratings.length).toFixed(1) : 0,
          rating_count: g.ratings?.length || 0,
          recent_rating_count: recentRatings.length
        };
      })
      .sort((a, b) => b.recent_rating_count - a.recent_rating_count)
      .slice(0, limit);
  };

  // ── Search Games ──
  const searchGames = async (query, { genre, minRating, year } = {}) => {
    let dbQuery = supabaseClient
      .from(TABLES.GAMES)
      .select(`*, ratings(rating_value)`)
      .ilike('title', `%${query}%`);

    if (genre) dbQuery = dbQuery.eq('genre', genre);
    if (year) dbQuery = dbQuery.gte('release_date', `${year}-01-01`).lte('release_date', `${year}-12-31`);

    const { data, error } = await dbQuery.limit(20);
    if (error) throw error;

    let results = (data || []).map(g => ({
      ...g,
      avg_rating: g.ratings?.length
        ? +(g.ratings.reduce((s, r) => s + r.rating_value, 0) / g.ratings.length).toFixed(1) : 0,
      rating_count: g.ratings?.length || 0
    }));

    if (minRating) results = results.filter(g => g.avg_rating >= minRating);
    return results;
  };

  // ── Get All Genres ──
  const fetchGenres = async () => {
    const { data, error } = await supabaseClient
      .from(TABLES.GAMES)
      .select('genre');
    if (error) throw error;
    return [...new Set((data || []).map(g => g.genre).filter(Boolean))].sort();
  };

  // ── Get Hero/Featured Game ──
  const fetchFeatured = async () => {
    const { data, error } = await supabaseClient
      .from(TABLES.GAMES)
      .select(`*, ratings(rating_value)`)
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) throw error;
    if (!data?.length) return null;
    const idx = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % data.length;
    const g = data[idx];
    return {
      ...g,
      avg_rating: g.ratings?.length
        ? +(g.ratings.reduce((s, r) => s + r.rating_value, 0) / g.ratings.length).toFixed(1) : 0,
      rating_count: g.ratings?.length || 0
    };
  };

  // ── User Bookmarks ──
  const fetchUserBookmarks = async (userId) => {
    const { data, error } = await supabaseClient
      .from(TABLES.BOOKMARKS)
      .select(`game_id, games(*, ratings(rating_value))`)
      .eq('user_id', userId);
    if (error) throw error;
    return (data || []).map(b => {
      const g = b.games;
      if (!g) return null;
      return {
        ...g,
        avg_rating: g.ratings?.length
          ? +(g.ratings.reduce((s, r) => s + r.rating_value, 0) / g.ratings.length).toFixed(1) : 0,
        rating_count: g.ratings?.length || 0
      };
    }).filter(Boolean);
  };

  const toggleBookmark = async (userId, gameId) => {
    // Check if exists
    const { data: existing } = await supabaseClient
      .from(TABLES.BOOKMARKS)
      .select('id')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single();

    if (existing) {
      await supabaseClient.from(TABLES.BOOKMARKS).delete()
        .eq('user_id', userId).eq('game_id', gameId);
      return false; // removed
    } else {
      await supabaseClient.from(TABLES.BOOKMARKS).insert({
        user_id: userId, game_id: gameId, created_at: new Date().toISOString()
      });
      return true; // added
    }
  };

  const isBookmarked = async (userId, gameId) => {
    const { data } = await supabaseClient
      .from(TABLES.BOOKMARKS)
      .select('id')
      .eq('user_id', userId)
      .eq('game_id', gameId)
      .single();
    return !!data;
  };

  return {
    fetchGames, fetchGame, fetchNewReleases, fetchTopRated,
    fetchTrending, searchGames, fetchGenres, fetchFeatured,
    fetchUserBookmarks, toggleBookmark, isBookmarked, PAGE_SIZE
  };
})();

window.Games = Games;
