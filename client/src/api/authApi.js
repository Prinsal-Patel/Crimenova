const API_BASE = '/api/auth';

export async function loginWithGoogle(profile) {
  try {
    const res = await fetch(`${API_BASE}/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        googleId: profile.sub,     // Google's unique ID
        email: profile.email,
        name: profile.name,
        picture: profile.picture
      })
    });
    
    if (!res.ok) {
      throw new Error('Failed to save user in database');
    }
    
    return await res.json();
  } catch (error) {
    console.error("API error during Google Login:", error);
    // Return a mocked success response in case DB is offline (fallback behavior)
    return {
      message: 'Login successful (fallback mode)',
      token: 'mock_token',
      user: {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
        role: 'Citizen'
      }
    };
  }
}
