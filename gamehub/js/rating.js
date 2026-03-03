// ============================================
// rating.js - Rating System Module
// ============================================

const Rating = (() => {

  // ── Submit or Update Rating ──
  const submitRating = async (gameId, userId, value) => {
    if (value < 1 || value > 5) throw new Error('Rating must be 1-5');

    // Check existing
    const { data: existing } = await supabaseClient
      .from(TABLES.RATINGS)
      .select('id')
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .single();

    let result;
    if (existing) {
      const { data, error } = await supabaseClient
        .from(TABLES.RATINGS)
        .update({ rating_value: value, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select().single();
      if (error) throw error;
      result = { ...data, isUpdate: true };
    } else {
      const { data, error } = await supabaseClient
        .from(TABLES.RATINGS)
        .insert({ game_id: gameId, user_id: userId, rating_value: value, created_at: new Date().toISOString() })
        .select().single();
      if (error) throw error;
      result = { ...data, isUpdate: false };
    }
    return result;
  };

  // ── Get User's Rating for a Game ──
  const getUserRating = async (gameId, userId) => {
    const { data } = await supabaseClient
      .from(TABLES.RATINGS)
      .select('rating_value')
      .eq('game_id', gameId)
      .eq('user_id', userId)
      .single();
    return data?.rating_value || null;
  };

  // ── Get Game's Rating Stats ──
  const getGameRatingStats = async (gameId) => {
    const { data, error } = await supabaseClient
      .from(TABLES.RATINGS)
      .select('rating_value')
      .eq('game_id', gameId);
    if (error) throw error;

    if (!data?.length) return { avg: 0, count: 0, distribution: {} };

    const avg = +(data.reduce((s, r) => s + r.rating_value, 0) / data.length).toFixed(1);
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    data.forEach(r => distribution[r.rating_value]++);

    return { avg, count: data.length, distribution };
  };

  // ── Delete Rating ──
  const deleteRating = async (gameId, userId) => {
    const { error } = await supabaseClient
      .from(TABLES.RATINGS)
      .delete()
      .eq('game_id', gameId)
      .eq('user_id', userId);
    if (error) throw error;
  };

  // ── Render Star Picker ──
  const renderStarPicker = (containerId, initialValue = 0, onChange) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    let selected = initialValue;

    container.innerHTML = '';
    container.className = 'star-picker';

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.className = 'star-pick' + (i <= selected ? ' active' : '');
      star.textContent = '★';
      star.dataset.value = i;

      star.addEventListener('mouseenter', () => {
        container.querySelectorAll('.star-pick').forEach((s, idx) => {
          s.classList.toggle('active', idx < i);
        });
      });

      star.addEventListener('mouseleave', () => {
        container.querySelectorAll('.star-pick').forEach((s, idx) => {
          s.classList.toggle('active', idx < selected);
        });
      });

      star.addEventListener('click', () => {
        selected = i;
        container.querySelectorAll('.star-pick').forEach((s, idx) => {
          s.classList.toggle('active', idx < i);
        });
        if (onChange) onChange(i);
      });

      container.appendChild(star);
    }

    return {
      getValue: () => selected,
      setValue: (v) => {
        selected = v;
        container.querySelectorAll('.star-pick').forEach((s, idx) => {
          s.classList.toggle('active', idx < v);
        });
      }
    };
  };

  // ── Render Star Display (read-only) ──
  const renderStars = (value, max = 5) => {
    let html = '<span class="stars">';
    for (let i = 1; i <= max; i++) {
      if (i <= Math.floor(value)) {
        html += '<span class="star filled">★</span>';
      } else if (i - 0.5 <= value) {
        html += '<span class="star half">★</span>';
      } else {
        html += '<span class="star">★</span>';
      }
    }
    html += '</span>';
    return html;
  };

  return { submitRating, getUserRating, getGameRatingStats, deleteRating, renderStarPicker, renderStars };
})();

window.Rating = Rating;
