// ============================================
// comments.js - Comments Module
// ============================================

const Comments = (() => {

  // ── Sanitize Input ──
  const sanitize = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // ── Validate Comment ──
  const validate = (content) => {
    if (!content || typeof content !== 'string') throw new Error('Comment cannot be empty');
    const trimmed = content.trim();
    if (trimmed.length < 2) throw new Error('Comment is too short');
    if (trimmed.length > 1000) throw new Error('Comment is too long (max 1000 characters)');
    return trimmed;
  };

  // ── Submit Comment ──
  const submitComment = async (gameId, userId, content) => {
    const validated = validate(content);
    const { data, error } = await supabaseClient
      .from(TABLES.COMMENTS)
      .insert({
        game_id: gameId,
        user_id: userId,
        content: validated,
        created_at: new Date().toISOString()
      })
      .select(`*, profiles(username, avatar_url)`)
      .single();
    if (error) throw error;
    return data;
  };

  // ── Fetch Comments ──
  const fetchComments = async (gameId, { page = 1, pageSize = 10 } = {}) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await supabaseClient
      .from(TABLES.COMMENTS)
      .select(`*, profiles(username, avatar_url)`, { count: 'exact' })
      .eq('game_id', gameId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;
    return { data: data || [], count, totalPages: Math.ceil(count / pageSize) };
  };

  // ── Delete Comment ──
  const deleteComment = async (commentId, userId) => {
    const { error } = await supabaseClient
      .from(TABLES.COMMENTS)
      .delete()
      .eq('id', commentId)
      .eq('user_id', userId);
    if (error) throw error;
  };

  // ── Format Date ──
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // ── Render Comment HTML ──
  const renderComment = (comment, currentUserId) => {
    const profile = comment.profiles;
    const username = sanitize(profile?.username || 'Anonymous');
    const initial = username[0]?.toUpperCase() || '?';
    const content = sanitize(comment.content);
    const date = formatDate(comment.created_at);
    const avatarHtml = profile?.avatar_url
      ? `<img src="${profile.avatar_url}" alt="${username}" loading="lazy">`
      : initial;
    const isOwner = currentUserId && comment.user_id === currentUserId;

    return `
      <div class="comment-item" data-id="${comment.id}">
        <div class="comment-avatar">${avatarHtml}</div>
        <div class="comment-body">
          <div class="comment-header">
            <span class="comment-username">${username}</span>
            <span class="comment-date">${date}</span>
            ${isOwner ? `<button class="btn btn-sm" style="margin-left:auto;color:#ef4444;padding:2px 8px;font-size:0.75rem" onclick="Comments.handleDelete('${comment.id}', '${currentUserId}', this)">Delete</button>` : ''}
          </div>
          <p class="comment-text">${content}</p>
        </div>
      </div>
    `;
  };

  // ── Handle Delete (UI) ──
  const handleDelete = async (commentId, userId, btn) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId, userId);
      const item = btn.closest('.comment-item');
      item.style.opacity = '0';
      setTimeout(() => item.remove(), 300);
      UI.toast('Comment deleted', 'success');
    } catch (err) {
      UI.toast('Failed to delete comment', 'error');
    }
  };

  // ── Subscribe to Real-time Comments ──
  const subscribe = (gameId, onInsert) => {
    return supabaseClient
      .channel(`comments:${gameId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'comments',
        filter: `game_id=eq.${gameId}`
      }, async (payload) => {
        // Fetch full comment with profile
        const { data } = await supabaseClient
          .from(TABLES.COMMENTS)
          .select(`*, profiles(username, avatar_url)`)
          .eq('id', payload.new.id)
          .single();
        if (data && onInsert) onInsert(data);
      })
      .subscribe();
  };

  return { submitComment, fetchComments, deleteComment, renderComment, handleDelete, subscribe, formatDate };
})();

window.Comments = Comments;
