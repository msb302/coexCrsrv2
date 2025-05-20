const express = require('express');
const bcrypt = require('bcryptjs');
const { verifyToken, generateToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roles');
const memoryDb = require('../models/memoryDb');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { email, password, name, phoneNumber, role, businessName, address } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      console.log('Missing required fields:', { email: !!email, password: !!password });
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Check if email already exists
    const existingUser = memoryDb.getUserByUsername(email);
    if (existingUser) {
      console.log('Email already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }
    
    // Validate role
    if (!['pharmacy', 'distributor', 'admin'].includes(role)) {
      console.log('Invalid role:', role);
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be pharmacy, distributor, or admin'
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Validate password length
    if (password.length < 1) {
      console.log('Password is empty');
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }
    
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user with role-specific fields
      const userData = {
        username: email, // Use email as username
        password: hashedPassword,
        name: name || '',
        email,
        phoneNumber: phoneNumber || '',
        role: role || 'pharmacy',
        businessName: businessName || '',
        address: address || '',
        createdAt: new Date()
      };
      
      console.log('Creating user with data:', { ...userData, password: '[REDACTED]' });
      
      // Add role-specific properties
      if (role === 'pharmacy') {
        userData.creditLimit = 1000; // Default credit limit in JD
      } else if (role === 'distributor') {
        userData.businessType = 'Distributor';
      }
      
      try {
        const newUser = memoryDb.createUser(userData);
        console.log('User created successfully:', { ...newUser, password: '[REDACTED]' });
        
        // Generate JWT
        const token = generateToken(newUser);
        
        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          token,
          user: newUser
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        return res.status(500).json({
          success: false,
          message: 'Error creating user in database',
          details: dbError.message
        });
      }
    } catch (hashError) {
      console.error('Password hashing error:', hashError);
      return res.status(500).json({
        success: false,
        message: 'Error processing password',
        details: hashError.message
      });
    }
  } catch (error) {
    console.error('Register error details:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user exists
    const user = memoryDb.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    // For testing purposes only - in a real app we'd never do this
    let isMatch = false;
    
    // First try direct comparison (for our seed data with plain text passwords)
    if (password === user.password) {
      isMatch = true;
    } else {
      // Then try bcrypt comparison (for properly hashed passwords)
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (err) {
        // If bcrypt throws an error, it means the stored password is not properly hashed
        isMatch = false;
      }
    }
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT
    const token = generateToken(user);
    
    // Return without password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', verifyToken, (req, res) => {
  try {
    const user = memoryDb.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
router.get('/users', verifyToken, isAdmin, (req, res) => {
  try {
    const pharmacies = memoryDb.getUsersByRole('pharmacy');
    const distributors = memoryDb.getUsersByRole('distributor');
    const admins = memoryDb.getUsersByRole('admin');
    
    res.json({
      success: true,
      data: {
        pharmacies,
        distributors,
        admins
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/auth/users/:id/credit-limit
 * @desc    Update pharmacy credit limit (admin only)
 * @access  Private/Admin
 */
router.put('/users/:id/credit-limit', verifyToken, isAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { creditLimit } = req.body;
    
    const user = memoryDb.getUserById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    if (user.role !== 'pharmacy') {
      return res.status(400).json({
        success: false,
        message: 'Credit limit can only be set for pharmacy users'
      });
    }
    
    const updatedUser = memoryDb.updateUser(id, { creditLimit });
    
    res.json({
      success: true,
      message: 'Credit limit updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update credit limit error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating credit limit',
      error: error.message
    });
  }
});

module.exports = router;
