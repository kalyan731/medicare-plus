import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    const loadSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      await setSessionUser(session?.user || null)
      setLoading(false)
    }

    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const setSessionUser = async (currentUser) => {
    setUser(currentUser)
    if (currentUser) {
      await loadProfile(currentUser.id)
    } else {
      setProfile(null)
    }
  }

  const loadProfile = async (userId) => {
    if (!isSupabaseConfigured || !userId) return

    try {
      // Try querying by appwrite_user_id first
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('appwrite_user_id', userId)
        .maybeSingle()

      // Fallback check by id if appwrite_user_id column is not yet migrated
      if (!data && error?.code === '42703') {
        const fallback = await supabase
          .from('profiles')
          .select('*')
          .eq('id', appwriteUserId)
          .maybeSingle()
        data = fallback.data
      }

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error loading profile from Supabase:', error.message)
    }
  }

  const signup = async ({ email, password, fullName, phone }) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim(), phone: phone || '' } },
      })

      if (error) return { data: null, error }

      if (data.user) {
        const profileData = {
          appwrite_user_id: data.user.id,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone || '',
        }
        const { error: profileError } = await supabase.from('profiles').upsert([profileData], { onConflict: 'appwrite_user_id' })
        if (profileError) console.warn('Could not save profile in Supabase:', profileError.message)
        setProfile(profileError ? null : profileData)
      }

      setUser(data.user)
      return { data: data.user, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const login = async (email, password) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (error) return { data: null, error }
      await setSessionUser(data.user)
      return { data: data.user, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const logout = async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      setProfile(null)
      return
    }

    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error logging out of Appwrite:', error.message)
    } finally {
      setUser(null)
      setProfile(null)
    }
  }

  const resetPasswordForEmail = async (email) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const resetPassword = async (_userId, _secret, newPassword) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
    }

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    profile,
    loading,
    signup,
    login,
    logout,
    resetPasswordForEmail,
    resetPassword,
    isAppwriteConfigured: isSupabaseConfigured,
    isSupabaseConfigured,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
