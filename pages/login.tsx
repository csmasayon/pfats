import { useEffect } from 'react';
import axios from 'axios';

const redirectUri = encodeURIComponent('http://localhost:3000/api/strava-auth');

export default function Login() {
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const response = await axios.get('/api/strava-client-id');
        const clientId = response.data.clientId;
        
        // Redirect the user to Strava authorization endpoint
        window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=read_all,profile:read_all,profile:write,activity:read_all,activity:write`;
      } catch (error) {
        console.error('Failed to fetch Strava client ID:', error);
      }
    };

    fetchClientId();
  }, []);

  return null;
}
