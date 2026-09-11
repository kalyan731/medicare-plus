import { createContext, useContext, useEffect, useState } from 'react'
import { ID } from 'appwrite'
import { appwriteAccount, isAppwriteConfigured } from '../lib/appwrite'
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
    if (!isAppwriteConfigured) {
      setLoading(false)
      return
    }

    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const currentUser = await appwriteAccount.get()
      setUser(currentUser)
      await loadProfile(currentUser.$id)
    } catch {
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
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
          .eq('id', userId)
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
    if (!isAppwriteConfigured) {
      throw new Error('Appwrite is not configured. Please add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to .env')
    }

    try {
      const newAccount = await appwriteAccount.create(ID.unique(), email.trim(), password, fullName.trim())
      await appwriteAccount.createEmailPasswordSession(email.trim(), password)
      const currentUser = await appwriteAccount.get()
      setUser(currentUser)

      if (isSupabaseConfigured) {
        const profileData = {
          appwrite_user_id: currentUser.$id,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone || '',
        }
        const { error: profileError } = await supabase.from('profiles').upsert([profileData], { onConflict: 'appwrite_user_id' })
        if (profileError) console.warn('Could not save profile in Supabase:', profileError.message)
        setProfile(profileError ? null : profileData)
      }

      return { data: newAccount, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const login = async (email, password) => {
    if (!isAppwriteConfigured) {
      throw new Error('Appwrite is not configured. Please add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to .env')
    }

    try {
      await appwriteAccount.createEmailPasswordSession(email.trim(), password)
      const currentUser = await appwriteAccount.get()
      setUser(currentUser)
      await loadProfile(currentUser.$id)
      return { data: currentUser, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const logout = async () => {
    if (!isAppwriteConfigured) {
      setUser(null)
      setProfile(null)
      return
    }

    try {
      await appwriteAccount.deleteSession('current')
    } catch (error) {
      console.error('Error logging out of Appwrite:', error.message)
    } finally {
      setUser(null)
      setProfile(null)
    }
  }

  const resetPasswordForEmail = async (email) => {
    if (!isAppwriteConfigured) {
      throw new Error('Appwrite is not configured. Please add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to .env')
    }

    try {
      await appwriteAccount.createRecovery(email.trim(), `${window.location.origin}/reset-password`)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const resetPassword = async (userId, secret, newPassword) => {
    if (!isAppwriteConfigured) {
      throw new Error('Appwrite is not configured. Please add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to .env')
    }

    try {
      await appwriteAccount.updateRecovery(userId, secret, newPassword, newPassword)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const updateAccount = async ({ fullName, email, phone, currentPassword, newPassword }) => {
    if (!isAppwriteConfigured) {
      throw new Error('Appwrite is not configured. Please add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to .env')
    }

    try {
      const trimmedName = fullName.trim()
      const trimmedEmail = email.trim()

      if (trimmedName && trimmedName !== user?.name) {
        await appwriteAccount.updateName(trimmedName)
      }

      if (trimmedEmail && trimmedEmail !== user?.email) {
        if (!currentPassword) throw new Error('Enter your current password to change your email.')
        await appwriteAccount.updateEmail(trimmedEmail, currentPassword)
      }

      if (newPassword) {
        if (!currentPassword) throw new Error('Enter your current password to change your password.')
        await appwriteAccount.updatePassword(newPassword, currentPassword)
      }

      const currentUser = await appwriteAccount.get()
      setUser(currentUser)

      const profileData = {
        appwrite_user_id: currentUser.$id,
        full_name: trimmedName || currentUser.name || '',
        email: currentUser.email,
        phone: phone.trim(),
      }

      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('profiles')
          .upsert([profileData], { onConflict: 'appwrite_user_id' })
        if (error) throw error
      }

      setProfile(profileData)
      return { data: currentUser, error: null }
    } catch (error) {
      return { data: null, error }
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
    updateAccount,
    isAppwriteConfigured,
    isSupabaseConfigured,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
