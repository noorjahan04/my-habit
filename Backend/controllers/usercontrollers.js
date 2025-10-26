const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/userModel');
const { sendResetEmail } = require('../utils/email');

const JWT_SECRET = process.env.JWT_SECRET || 'replace_me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const RESET_TOKEN_BYTES = 32; // raw token size
const RESET_TOKEN_EXPIRES_MIN = 60; // minutes until token expires

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

exports.register = async (req, res) => {
  try {
    const { name = '', email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email: email.toLowerCase(), passwordHash });
    await user.save();

    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('register error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ message: "Email required" })
  
      const user = await User.findOne({ email: email.toLowerCase() })
      if (!user) return res.json({ ok: true }) // Don’t reveal registered emails
  
      // Generate and hash token
      const rawToken = crypto.randomBytes(RESET_TOKEN_BYTES).toString("hex")
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex")
  
      user.resetPasswordTokenHash = tokenHash
      user.resetPasswordExpires = Date.now() + RESET_TOKEN_EXPIRES_MIN * 60 * 1000
      await user.save()
  
      // Instead of frontend link, just show token in response (for Postman)
      const resetLink = `http://localhost:5177/reset-password?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
  
      console.log("Password Reset Link (Postman):", resetLink)
  
      // Optional: send email too (if Nodemailer configured)
      await sendResetEmail({
        to: user.email,
        name: user.name || "",
        resetLink,
      })
  
      return res.json({
        ok: true,
        message: "Password reset link generated successfully (check console or email)",
        link: resetLink, // 👈 This helps you test in Postman easily
        rawtoken:rawToken
      })
    } catch (err) {
      console.error("forgotPassword error", err)
      return res.status(500).json({ message: "Server error" })
    }
  }


exports.resetPassword = async (req, res) => {
  try {
    const { token, email, password } = req.body;
    if (!token || !email || !password)
      return res.status(400).json({ message: 'Token, email, and new password are required' });

    // Hash provided token
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid token
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    // Clear reset fields
    user.resetPasswordTokenHash = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Return new JWT
    const authToken = signToken(user);
    return res.json({
      ok: true,
      token: authToken,
      message: 'Password reset successful!',
      user: { id: user._id, email: user.email, name: user.name },
    });

  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



