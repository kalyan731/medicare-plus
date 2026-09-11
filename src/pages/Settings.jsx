import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Mail, Phone, Save, UserRound, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
    const { user, profile, updateAccount } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName: profile?.full_name || user?.name || '',
        email: user?.email || '',
        phone: profile?.phone || '',
        currentPassword: '',
        newPassword: '',
    })
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleChange = (event) => {
        setFormData((previous) => ({ ...previous, [event.target.name]: event.target.value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setSaving(true)
        setMessage('')
        setError('')

        const { error: updateError } = await updateAccount(formData)
        if (updateError) {
            setError(updateError.message || 'Could not update your account.')
        } else {
            setMessage('Your account details have been updated.')
            setFormData((previous) => ({ ...previous, currentPassword: '', newPassword: '' }))
        }
        setSaving(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-pharmacy-600 mb-6 font-medium"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 sm:p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Account Settings</h1>
                        <p className="text-gray-500 mt-1">Keep your personal details up to date.</p>
                    </div>

                    {message && (
                        <div className="mb-6 flex items-center space-x-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                            <CheckCircle className="w-5 h-5" />
                            <span>{message}</span>
                        </div>
                    )}
                    {error && (
                        <div className="mb-6 flex items-center space-x-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="settings-fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">Full name</label>
                            <div className="relative">
                                <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input id="settings-fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-pharmacy-500" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="settings-email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input id="settings-email" type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-pharmacy-500" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="settings-phone" className="block text-sm font-semibold text-gray-700 mb-1.5">Phone number</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input id="settings-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-pharmacy-500" />
                            </div>
                        </div>
                        <div className="pt-5 border-t border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Change password</h2>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder="Current password" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-pharmacy-500" />
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} minLength={8} placeholder="New password (optional)" className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 outline-none focus:ring-2 focus:ring-pharmacy-500" />
                                </div>
                            </div>
                        </div>
                        <button type="submit" disabled={saving} className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-6 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-semibold rounded-xl shadow-md disabled:opacity-50">
                            <Save className="w-5 h-5" />
                            <span>{saving ? 'Saving...' : 'Save changes'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}