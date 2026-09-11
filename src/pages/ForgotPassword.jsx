import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, AlertCircle, CheckCircle2, HeartPulse, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const { resetPasswordForEmail, isAppwriteConfigured } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)

    try {
      const { error } = await resetPasswordForEmail(email.trim())

      if (error) {
        setError(error.message || 'Failed to send password reset email. Please try again.')
        return
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pharmacy-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-pharmacy-500/5 border border-gray-100">

        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 group mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pharmacy-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-pharmacy-500/20">
              <HeartPulse className="w-7 h-7" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Forgot Password?
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        {!isAppwriteConfigured && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-semibold mb-0.5">Appwrite not configured in .env</p>
              <p>Please add VITE_APPWRITE_ENDPOINT and VITE_APPWRITE_PROJECT_ID to enable password reset.</p>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-start space-x-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {success ? (
          <div className="space-y-6">
            <div className="p-5 bg-green-50 border border-green-200 rounded-2xl text-green-800 text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-semibold text-lg text-green-900">Check your inbox</h3>
              <p className="text-sm text-green-700">
                We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions to set a new password.
              </p>
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full py-3.5 px-6 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-semibold rounded-xl shadow-md shadow-pharmacy-600/30 transition-all space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pharmacy-500 focus:border-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 bg-pharmacy-600 hover:bg-pharmacy-700 text-white font-semibold rounded-xl shadow-md shadow-pharmacy-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Sending link...</span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Reset Link</span>
                </>
              )}
            </button>

            {/* Back to Login Link */}
            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-pharmacy-700 transition-colors space-x-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
