const db = require('../config/db.config');
const Joi = require('joi');

// Validation schema for student profile
const studentProfileSchema = Joi.object({
  collegeId: Joi.number().integer().allow(null),
  entranceExamName: Joi.string().required(),
  entranceExamPercentile: Joi.number().precision(2).min(0).max(100).required(),
  category: Joi.string().valid('General', 'OBC', 'SC', 'ST', 'EWS').required(),
  stream: Joi.string().required(),
  passingYear: Joi.number().integer().min(1990).max(2100).required(),
  cutoffPoints: Joi.number().precision(2).required(),
  interestedCourses: Joi.string().required()
});

// Create student profile
exports.createProfile = async (req, res) => {
  try {
    const { error } = studentProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.userId;

    // Check if profile already exists
    const [existingProfiles] = await db.query(
      'SELECT * FROM student_profile WHERE user_id = ?',
      [userId]
    );

    if (existingProfiles.length > 0) {
      return res.status(400).json({ message: 'Student profile already exists' });
    }

    const {
      collegeId,
      entranceExamName,
      entranceExamPercentile,
      category,
      stream,
      passingYear,
      cutoffPoints,
      interestedCourses
    } = req.body;

    // Insert profile
    const [result] = await db.query(
      `INSERT INTO student_profile 
      (user_id, college_id, entrance_exam_name, entrance_exam_percentile, category, stream, passing_year, cutoff_points, interested_courses, is_verified) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        collegeId,
        entranceExamName,
        entranceExamPercentile,
        category,
        stream,
        passingYear,
        cutoffPoints,
        interestedCourses,
        false // Not verified initially
      ]
    );

    res.status(201).json({
      message: 'Student profile created successfully',
      studentId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating student profile' });
  }
};

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const [profiles] = await db.query(
      `SELECT s.*, c.college_name 
       FROM student_profile s
       LEFT JOIN college_master_details c ON s.college_id = c.college_id
       WHERE s.user_id = ?`,
      [userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.status(200).json({ profile: profiles[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student profile' });
  }
};

// Update student profile
exports.updateProfile = async (req, res) => {
  try {
    const { error } = studentProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.userId;
    const {
      collegeId,
      entranceExamName,
      entranceExamPercentile,
      category,
      stream,
      passingYear,
      cutoffPoints,
      interestedCourses
    } = req.body;

    // Check if profile exists
    const [profiles] = await db.query(
      'SELECT * FROM student_profile WHERE user_id = ?',
      [userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Update profile
    await db.query(
      `UPDATE student_profile SET
      college_id = ?,
      entrance_exam_name = ?,
      entrance_exam_percentile = ?,
      category = ?,
      stream = ?,
      passing_year = ?,
      cutoff_points = ?,
      interested_courses = ?
      WHERE user_id = ?`,
      [
        collegeId,
        entranceExamName,
        entranceExamPercentile,
        category,
        stream,
        passingYear,
        cutoffPoints,
        interestedCourses,
        userId
      ]
    );

    res.status(200).json({ message: 'Student profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating student profile' });
  }
};

// Verify student by email domain
exports.verifyStudentByEmail = async (req, res) => {
  try {
    const userId = req.userId;
    
    // Get user info
    const [users] = await db.query('SELECT * FROM user WHERE user_id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    const userEmail = user.email;
    
    // Extract domain from email
    const emailDomain = userEmail.split('@')[1];
    
    // Find college with matching domain
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE email_domain = ?',
      [emailDomain]
    );
    
    if (colleges.length === 0) {
      return res.status(404).json({ 
        message: 'No college found with matching email domain',
        verified: false
      });
    }
    
    const college = colleges[0];
    
    // Update student profile to set college_id and verification status
    const [profiles] = await db.query(
      'SELECT * FROM student_profile WHERE user_id = ?',
      [userId]
    );
    
    if (profiles.length === 0) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    await db.query(
      'UPDATE student_profile SET college_id = ?, is_verified = ? WHERE user_id = ?',
      [college.college_id, true, userId]
    );
    
    res.status(200).json({ 
      message: 'Student verification successful',
      verified: true,
      college: {
        id: college.college_id,
        name: college.college_name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying student' });
  }
};

// Compare colleges
exports.compareColleges = async (req, res) => {
  try {
    const { collegeId1, collegeId2 } = req.query;
    
    if (!collegeId1 || !collegeId2) {
      return res.status(400).json({ message: 'Two college IDs are required for comparison' });
    }
    
    // Get college details
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id IN (?, ?)',
      [collegeId1, collegeId2]
    );
    
    if (colleges.length < 2) {
      return res.status(404).json({ message: 'One or both colleges not found' });
    }
    
    // Get infrastructure
    const [infrastructure] = await db.query(
      'SELECT * FROM college_infrastructure_details WHERE college_id IN (?, ?)',
      [collegeId1, collegeId2]
    );
    
    // Get placement details
    const [placements] = await db.query(
      'SELECT * FROM college_placement_details WHERE college_id IN (?, ?)',
      [collegeId1, collegeId2]
    );
    
    // Get courses
    const [courses] = await db.query(
      'SELECT * FROM college_courses_details WHERE college_id IN (?, ?)',
      [collegeId1, collegeId2]
    );
    
    // Get scholarship details
    const [scholarships] = await db.query(
      'SELECT * FROM college_scholarship_details WHERE college_id IN (?, ?)',
      [collegeId1, collegeId2]
    );
    
    // Format response
    const comparison = {
      colleges: colleges.reduce((acc, college) => {
        acc[college.college_id] = college;
        return acc;
      }, {}),
      
      infrastructure: infrastructure.reduce((acc, item) => {
        acc[item.college_id] = item;
        return acc;
      }, {}),
      
      placements: placements.reduce((acc, placement) => {
        if (!acc[placement.college_id]) {
          acc[placement.college_id] = [];
        }
        acc[placement.college_id].push(placement);
        return acc;
      }, {}),
      
      courses: courses.reduce((acc, course) => {
        if (!acc[course.college_id]) {
          acc[course.college_id] = [];
        }
        acc[course.college_id].push(course);
        return acc;
      }, {}),
      
      scholarships: scholarships.reduce((acc, scholarship) => {
        if (!acc[scholarship.college_id]) {
          acc[scholarship.college_id] = [];
        }
        acc[scholarship.college_id].push(scholarship);
        return acc;
      }, {})
    };
    
    res.status(200).json({ comparison });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error comparing colleges' });
  }
};
