const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

const generateAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );
};

const generateAndSetRefreshToken = async (user, res) => {
  const refreshToken = jwt.sign(
    { sub: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );

  const salt = await bcrypt.genSalt(10);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, salt);
  await user.save();

  res.cookie('refreshToken', refreshToken, getCookieOptions());
  return refreshToken;
};

router.post('/signup', async (req, res, next) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (!displayName || displayName.trim().length === 0) {
      return res.status(400).json({ error: 'Display name is required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email.toLowerCase(),
      passwordHash,
      displayName: displayName.trim()
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    await generateAndSetRefreshToken(newUser, res);

    res.status(201).json({
      user: { id: newUser._id, displayName: newUser.displayName, email: newUser.email },
      accessToken
    });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    await generateAndSetRefreshToken(user, res);

    res.json({
      user: { id: user._id, displayName: user.displayName, email: user.email },
      accessToken
    });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.sub);
    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const isMatch = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({
      accessToken: newAccessToken,
      user: { id: user._id, displayName: user.displayName, email: user.email }
    });
  } catch (err) {
    next(err);
  }
});

router.post('/logout', async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, { ignoreExpiration: true });
        const user = await User.findById(decoded.sub);
        if (user) {
          user.refreshTokenHash = null;
          await user.save();
        }
      } catch (err) {
        // ignore errors during logout
      }
    }
    res.clearCookie('refreshToken', getCookieOptions());
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /me — verify current session
const authMiddleware = require('../middleware/auth');
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('_id email displayName createdAt');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { id: user._id, email: user.email, displayName: user.displayName } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
