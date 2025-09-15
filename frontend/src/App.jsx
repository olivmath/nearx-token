import React from 'react'
import useAuthStore from './store/authStore'
import Auth from './components/Auth'
import Quiz from './components/Quiz'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <div className="min-h-screen">
      {isAuthenticated ? <Quiz /> : <Auth />}
    </div>
  )
}

export default App
