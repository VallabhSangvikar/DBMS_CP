const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config');
const Joi = require('joi');

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  userType: Joi.string().valid('student', 'institute', 'faculty').required()
});

// User registration
exports.register = async (req, res) => {
  try {
    // Validate request
    console.log('Request body:', req.body);
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { username, email, password, phone, userType } = req.body;

    // Check if email already exists
    const [existingUsers] = await db.query(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if phone already exists
    const [existingPhones] = await db.query(
      'SELECT * FROM user WHERE phone = ?',
      [phone]
    );

    if (existingPhones.length > 0) {
      return res.status(400).json({ message: 'Phone number already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO user (username, email, password, phone, user_type) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, phone, userType]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, userType },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        username,
        email,
        userType
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const [users] = await db.query('SELECT * FROM user WHERE email = ?', [email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.user_id, userType: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        userType: user.user_type
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const [users] = await db.query('SELECT user_id, username, email, phone, user_type FROM user WHERE user_id = ?', [userId]);

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = users[0];

    // Get additional profile details based on user type
    let profileDetails = {};
    
    if (user.user_type === 'student') {
      const [students] = await db.query('SELECT * FROM student_profile WHERE user_id = ?', [userId]);
      if (students.length > 0) {
        profileDetails = students[0];
      }
    } else if (user.user_type === 'faculty') {
      const [faculty] = await db.query('SELECT * FROM college_faculty_details WHERE user_id = ?', [userId]);
      if (faculty.length > 0) {
        profileDetails = faculty[0];
      }
    } else if (user.user_type === 'institute') {
      const [college] = await db.query('SELECT * FROM college_master_details WHERE user_id = ?', [userId]);
      if (college.length > 0) {
        profileDetails = college[0];
      }
    }

    res.status(200).json({
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        userType: user.user_type,
        ...profileDetails
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};
