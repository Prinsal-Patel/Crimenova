import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/google
// Called by frontend after successful Google OAuth to store/update user data
router.post('/google', async (req, res) => {
  try {
    const { googleId, email, name, picture } = req.body;
    
    if (!googleId || !email) {
      return res.status(400).json({ message: 'Missing required Google profile data' });
    }

    // Find existing user or create a new one
    let user = await User.findOne({ googleId });
    
    if (user) {
      // Update last login and potentially updated profile info
      user.lastLogin = Date.now();
      user.name = name;
      user.picture = picture;
      await user.save();
    } else {
      // Create new user in DB
      user = new User({
        googleId,
        email,
        name,
        picture
      });
      await user.save();
    }

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    res.status(500).json({ message: 'Server error during authentication' });
  }
});

export default router;
