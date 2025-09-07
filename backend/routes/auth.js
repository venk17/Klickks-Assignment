import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../db.js';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  try {
    // Check if user already exists (better-sqlite3 syntax)
    const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = db.prepare('INSERT INTO users (email, password) VALUES (?, ?)')
                   .run(email, hashedPassword);

    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.lastInsertRowid 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Get user (better-sqlite3 syntax)
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Create session
    req.session.userId = user.id;
    req.session.email = user.email;

    res.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Dashboard route (protected)
router.get('/dashboard', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const user = db.prepare('SELECT id, email, created_at FROM users WHERE id = ?')
                  .get(req.session.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Welcome to your dashboard!',
      user: {
        id: user.id,
        email: user.email,
        memberSince: user.created_at
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }

    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Check authentication status
router.get('/check-auth', (req, res) => {
  if (req.session.userId) {
    res.json({ 
      isAuthenticated: true,
      user: {
        id: req.session.userId,
        email: req.session.email
      }
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

export default router;