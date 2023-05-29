import React from 'react'
import axios from 'axios'

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      // Make a request to the logout API route
      await axios.get('/api/logout')

      // Redirect the user to the dashboard or login page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  return (
    <button type="button" className="bg-red-5001 hover:bg-red-700 text-white font-bold py-2 px-3 mt-4 rounded" onClick={handleLogout}>Log Out</button>
  )
}

export default LogoutButton