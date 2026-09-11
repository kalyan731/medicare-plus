import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loading message="Checking authentication..." />
  }

  if (!user) {
    // Redirect to login page and remember the page they were trying to visit
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
