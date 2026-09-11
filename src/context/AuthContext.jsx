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

    // Check existing Appwrite session
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      const currentUser = await appwriteAccount.get()
      setUser(currentUser)
      if (currentUser) {
        loadProfile(currentUser.$id)
      }
    } catch {
      // User is not logged in / no active session
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (appwriteUserId) => {
    if (!isSupabaseConfigured || !appwriteUserId) return

    try {
      // Try querying by appwrite_user_id first
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('appwrite_user_id', appwriteUserId)
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
    if (!isAppwriteConfigured) {
      throw new Error('Appwrite is not configured. Please add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to .env')
    }

    try {
      // 1. Create user in Appwrite
      const newAccount = await appwriteAccount.create(
        ID.unique(),
        email.trim(),
        password,
        fullName.trim()
      )

      // 2. Automatically log in the user with Appwrite
      await appwriteAccount.createEmailPasswordSession(email.trim(), password)

      // 3. Fetch active user
      const currentUser = await appwriteAccount.get()
      setUser(currentUser)

      // 4. Store profile in Supabase Database (profiles table)
      if (isSupabaseConfigured) {
        try {
          const profileData = {
            appwrite_user_id: currentUser.$id,
            full_name: fullName.trim(),
            email: email.trim(),
            phone: phone || '',
          }

          const { error: profileError } = await supabase
            .from('profiles')
            .insert([profileData])

          if (profileError) {
            console.warn('Could not insert profile into Supabase (will retry or use fallback):', profileError.message)
          } else {
            setProfile(profileData)
          }
        } catch (dbErr) {
          console.warn('Database profile insertion error:', dbErr.message)
        }
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
      // Create session in Appwrite
      await appwriteAccount.createEmailPasswordSession(email.trim(), password)

      // Get current user details
      const currentUser = await appwriteAccount.get()
      setUser(currentUser)

      // Load user profile from Supabase
      if (currentUser) {
        loadProfile(currentUser.$id)
      }

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
      // Appwrite sends a recovery email with a link: url?userId=...&secret=...
      const resetUrl = `${window.location.origin}/reset-password`
      await appwriteAccount.createRecovery(email.trim(), resetUrl)
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
      // Appwrite updates password with recovery secret
      await appwriteAccount.updateRecovery(userId, secret, newPassword, newPassword)
      return { error: null }
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
    isAppwriteConfigured,
    isSupabaseConfigured,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
