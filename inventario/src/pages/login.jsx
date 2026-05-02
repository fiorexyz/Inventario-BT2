import { Navigate } from 'react-router-dom'
import Login from '../components/Login'

export default function LoginPage({ user, onLogin }) {
  if (user) {
    return <Navigate to="/" replace />
  }

  return <Login onLogin={onLogin} />
}
