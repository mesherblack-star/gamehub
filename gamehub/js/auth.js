// ============================================
// auth.js - Authentication Module
// ============================================

const Auth = (() => {
  let currentUser = null;
  let currentProfile = null;

  const getUser = async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    currentUser = session?.user || null;
    return currentUser;
  };

  const getSession = async () => {
    const { data: { session } } = await supabaseClient.auth.getSession();
    return session;
  };

  const register = async (email, password, username) => {
    const { data, error } = await supabaseClient.auth.signUp({
      email, password,
      options: { data: { username } }
    });
    if (error) throw error;
    if (data.user) {
      await supabaseClient.from(TABLES.PROFILES).upsert({
        id: data.user.id, username, email,
        created_at: new Date().toISOString()
      }, { onConflict: 'id' });
    }
    return data;
  };

  const login = async (email, password) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Supabase login error', error);
      // normalize error message
      const msg = error.message || error.error_description || (error?.status ? `HTTP ${error.status}` : 'Login failed');
      throw new Error(msg);
    }
    currentUser = data.user;
    await loadProfile();
    return data;
  };

  const logout = async () => {
    await supabaseClient.auth.signOut();
    currentUser = null;
    currentProfile = null;
    window.location.href = '/login.html';
  };

  const loadProfile = async () => {
    if (!currentUser) return null;
    const { data, error } = await supabaseClient
      .from(TABLES.PROFILES).select('*').eq('id', currentUser.id).single();
    if (!error) currentProfile = data;
    return currentProfile;
  };

  const updateProfile = async (updates) => {
    if (!currentUser) throw new Error('Not authenticated');
    const { data, error } = await supabaseClient
      .from(TABLES.PROFILES)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', currentUser.id).select().single();
    if (error) throw error;
    currentProfile = data;
    return data;
  };

  const updateAvatar = async (file) => {
    if (!currentUser) throw new Error('Not authenticated');
    const ext = file.name.split('.').pop();
    const filePath = `${currentUser.id}/avatar.${ext}`;
    const { error: uploadError } = await supabaseClient.storage
      .from(BUCKETS.AVATARS).upload(filePath, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data: { publicUrl } } = supabaseClient.storage
      .from(BUCKETS.AVATARS).getPublicUrl(filePath);
    await updateProfile({ avatar_url: publicUrl });
    return publicUrl;
  };

  const updatePassword = async (newPassword) => {
    const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  const onAuthStateChange = (callback) => {
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      currentUser = session?.user || null;
      if (currentUser) await loadProfile();
      callback(event, session, currentUser);
    });
  };

  const requireAuth = async (redirectUrl = '/login.html') => {
    const user = await getUser();
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
      window.location.href = redirectUrl;
      return null;
    }
    await loadProfile();
    return user;
  };

  const redirectIfLoggedIn = async (redirectUrl = '/index.html') => {
    const user = await getUser();
    if (user) window.location.href = redirectUrl;
  };

  const getPublicProfile = async (userId) => {
    const { data } = await supabaseClient
      .from(TABLES.PROFILES)
      .select('id, username, avatar_url, created_at')
      .eq('id', userId).single();
    return data;
  };

  const getCurrentUser = () => currentUser;
  const getCurrentProfile = () => currentProfile;

  const init = async () => {
    await getUser();
    if (currentUser) await loadProfile();
    return { user: currentUser, profile: currentProfile };
  };

  return {
    init, getUser, getSession, register, login, logout,
    loadProfile, updateProfile, updateAvatar, updatePassword,
    onAuthStateChange, requireAuth, redirectIfLoggedIn,
    getPublicProfile, getCurrentUser, getCurrentProfile
  };
})();

window.Auth = Auth;
