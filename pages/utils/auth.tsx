export const isAccessTokenValid = () => {
    if (typeof document !== 'undefined') {
      const decodedCookie = decodeURIComponent(document.cookie);
      const cookies = decodedCookie.split(';');
      const accessTokenCookie = cookies.find((cookie) => cookie.trim().startsWith('access_token='));
  
      if (accessTokenCookie) {
        const accessToken = accessTokenCookie.split('=')[1];
        // Check if the access token is valid
        // You can add your own logic here
        return !!accessToken;
      }
    }
  
    return false;
  };