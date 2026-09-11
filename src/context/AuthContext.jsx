import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        if (!isSupabaseConfigured) {
            setLoading(false)
            return undefined
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
        if (!currentUser) {
            setProfile(null)
            return
        }
        await loadProfile(currentUser)
    }

    const loadProfile = async (currentUser) => {
        const profileData = {
            id: currentUser.id,
            full_name: currentUser.user_metadata?.full_name || currentUser.email?.split('@')[0] || '',
            email: currentUser.email || '',
            phone: currentUser.user_metadata?.phone || '',
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .maybeSingle()

        if (data) {
            setProfile(data)
            return data
        }

        if (error && error.code !== 'PGRST116') {
            console.error('Error loading profile from Supabase:', error.message)
            return null
        }

        const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert([profileData])
            .select()
            .single()

        if (createError) {
            console.error('Error creating Supabase profile:', createError.message)
            return null
        }

        setProfile(createdProfile)
        return createdProfile
    }

    const signup = async ({ email, password, fullName, phone }) => {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')

        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: { data: { full_name: fullName.trim(), phone: phone || '' } },
        })

        if (error || !data.user) return { data: null, error }
        await loadProfile(data.user)
        return { data: data.user, error: null }
    }

    const login = async (email, password) => {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) return { data: null, error }
        await setSessionUser(data.user)
        return { data: data.user, error: null }
    }

    const logout = async () => {
        if (isSupabaseConfigured) await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
    }

    const resetPasswordForEmail = async (email) => {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        return { error }
    }

    const resetPassword = async (_userId, _secret, newPassword) => {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
        const { error } = await supabase.auth.updateUser({ password: newPassword })
        return { error }
    }

    const updateAccount = async ({ fullName, email, phone, currentPassword, newPassword }) => {
        if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')

        if (email.trim() !== user?.email && !currentPassword) {
            return { data: null, error: new Error('Enter your current password to change your email.') }
        }

        const updates = { data: { full_name: fullName.trim(), phone: phone.trim() } }
        if (email.trim() !== user?.email) updates.email = email.trim()
        if (newPassword) updates.password = newPassword

        const { data: authData, error: authError } = await supabase.auth.updateUser(updates)
        if (authError) return { data: null, error: authError }

        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .upsert([{ id: user.id, full_name: fullName.trim(), email: email.trim(), phone: phone.trim() }])
            .select()
            .single()
        if (profileError) return { data: null, error: profileError }

        setUser(authData.user)
        setProfile(profileData)
        return { data: authData.user, error: null }
    }

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            signup,
            login,
            logout,
            resetPasswordForEmail,
            resetPassword,
            updateAccount,
            isAppwriteConfigured: isSupabaseConfigured,
            isSupabaseConfigured,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
