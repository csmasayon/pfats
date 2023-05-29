import { useRouter } from 'next/router'

const LogoutButton = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' })
      router.push('/') // Redirect to the home page or any desired location
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 mt-4 rounded" onClick={handleLogout}>Log Out</button>
  )
}

export default LogoutButton
