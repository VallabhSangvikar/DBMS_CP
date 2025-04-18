const db = require('../config/db.config');
const Joi = require('joi');

// Validation schema for course
const courseSchema = Joi.object({
  college_id: Joi.number().integer().required(),
  course_name: Joi.string().required(),
  duration: Joi.number().integer().required(),
  fee: Joi.number().precision(2).required()
});

// Validation schema for cutoff details
const cutoffSchema = Joi.object({
  courseId: Joi.number().integer().required(),
  general: Joi.number().precision(2).min(0).max(100).required(),
  obc: Joi.number().precision(2).min(0).max(100).required(),
  sc: Joi.number().precision(2).min(0).max(100).required(),
  st: Joi.number().precision(2).min(0).max(100).required(),
  ews: Joi.number().precision(2).min(0).max(100).required(),
  year: Joi.number().integer().min(2000).max(new Date().getFullYear() + 1).required()
});

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    // Allow filtering by college
    const collegeId = req.query.collegeId;
    
    let query = 'SELECT c.*, cm.college_name FROM college_courses_details c JOIN college_master_details cm ON c.college_id = cm.college_id';
    let params = [];
    
    if (collegeId) {
      query += ' WHERE c.college_id = ?';
      params.push(collegeId);
    }
    
    const [courses] = await db.query(query, params);
    res.status(200).json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching courses' });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const [courses] = await db.query(
      `SELECT c.*, cm.college_name 
       FROM college_courses_details c 
       JOIN college_master_details cm ON c.college_id = cm.college_id 
       WHERE c.course_id = ?`,
      [courseId]
    );
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ course: courses[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching course details' });
  }
};

// Get course cutoff
exports.getCourseCutoff = async (req, res) => {
  try {
    const courseId = req.params.id;
    const [cutoffs] = await db.query(
      'SELECT * FROM college_cutoff_details WHERE course_id = ?',
      [courseId]
    );

    res.status(200).json({ cutoffs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching course cutoffs' });
  }
};

// Get course cutoffs
exports.getCourseCutoffs = async (req, res) => {
  try {
    const courseId = req.params.id;
    const [cutoffs] = await db.query(
      'SELECT * FROM college_cutoff_details WHERE course_id = ? ORDER BY academic_year DESC',
      [courseId]
    );
    res.status(200).json({ cutoffs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching course cutoffs' });
  }
};

// Create course
exports.createCourse = async (req, res) => {
  try {

    const user_id = req.userId;
    const { college_id, course_name, duration, fee } = req.body;

    // Verify college ownership
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ? AND user_id = ?',
      [college_id, user_id]
    );

    if (colleges.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to add courses to this college' });
    }

    // Insert course
    const [result] = await db.query(
      'INSERT INTO college_courses_details (college_id, course_name, duration, fee) VALUES (?, ?, ?, ?)',
      [college_id, course_name, duration, fee]
    );

    res.status(201).json({
      message: 'Course created successfully',
      course_id: result.insert_id
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating course' });
  }
};

// Create course cutoff
exports.createCourseCutoff = async (req, res) => {
  try {
    const { error } = cutoffSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.userId;
    const { courseId, general, obc, sc, st, ews, year } = req.body;

    // Verify course ownership
    const [courses] = await db.query(
      `SELECT c.* FROM college_courses_details c 
       JOIN college_master_details cm ON c.college_id = cm.college_id 
       WHERE c.course_id = ? AND cm.user_id = ?`,
      [courseId, userId]
    );

    if (courses.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to add cutoffs for this course' });
    }

    // Check if cutoff for this year already exists
    const [existingCutoffs] = await db.query(
      'SELECT * FROM course_cutoff_details WHERE course_id = ? AND year = ?',
      [courseId, year]
    );

    if (existingCutoffs.length > 0) {
      return res.status(400).json({ message: 'Cutoff for this year already exists. Use update endpoint.' });
    }

    // Insert cutoff
    const [result] = await db.query(
      `INSERT INTO course_cutoff_details 
      (course_id, general, obc, sc, st, ews, year) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [courseId, general, obc, sc, st, ews, year]
    );

    res.status(201).json({
      message: 'Course cutoff created successfully',
      cutoffId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating course cutoff' });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.userId;
    const { courseName, duration, fee } = req.body;

    // Verify ownership
    const [courses] = await db.query(
      `SELECT c.* FROM college_courses_details c
       JOIN college_master_details cm ON c.college_id = cm.college_id
       WHERE c.course_id = ? AND cm.user_id = ?`,
      [courseId, userId]
    );

    if (courses.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this course' });
    }

    // Update course
    await db.query(
      'UPDATE college_courses_details SET course_name = ?, duration = ?, fee = ? WHERE course_id = ?',
      [courseName, duration, fee, courseId]
    );

    res.status(200).json({ message: 'Course updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating course' });
  }
};

// Update course cutoff
exports.updateCourseCutoff = async (req, res) => {
  try {
    const cutoffId = req.params.id;
    const userId = req.userId;
    const { general, obc, sc, st, ews } = req.body;

    // Verify ownership
    const [cutoffs] = await db.query(
      `SELECT cc.* FROM course_cutoff_details cc
       JOIN college_courses_details c ON cc.course_id = c.course_id
       JOIN college_master_details cm ON c.college_id = cm.college_id
       WHERE cc.cutoff_id = ? AND cm.user_id = ?`,
      [cutoffId, userId]
    );

    if (cutoffs.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this cutoff' });
    }

    // Update cutoff
    await db.query(
      `UPDATE course_cutoff_details SET
       general = ?,
       obc = ?,
       sc = ?,
       st = ?,
       ews = ?
       WHERE cutoff_id = ?`,
      [general, obc, sc, st, ews, cutoffId]
    );

    res.status(200).json({ message: 'Course cutoff updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating course cutoff' });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.userId;

    // Verify ownership
    const [courses] = await db.query(
      `SELECT c.* FROM college_courses_details c
       JOIN college_master_details cm ON c.college_id = cm.college_id
       WHERE c.course_id = ? AND cm.user_id = ?`,
      [courseId, userId]
    );

    if (courses.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to delete this course' });
    }

    // Delete course
    await db.query('DELETE FROM college_courses_details WHERE course_id = ?', [courseId]);

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting course' });
  }
};

// Delete course cutoff
exports.deleteCourseCutoff = async (req, res) => {
  try {
    const cutoffId = req.params.id;
    const userId = req.userId;

    // Verify ownership
    const [cutoffs] = await db.query(
      `SELECT cc.* FROM course_cutoff_details cc
       JOIN college_courses_details c ON cc.course_id = c.course_id
       JOIN college_master_details cm ON c.college_id = cm.college_id
       WHERE cc.cutoff_id = ? AND cm.user_id = ?`,
      [cutoffId, userId]
    );

    if (cutoffs.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to delete this cutoff' });
    }

    // Delete cutoff
    await db.query('DELETE FROM course_cutoff_details WHERE cutoff_id = ?', [cutoffId]);

    res.status(200).json({ message: 'Course cutoff deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting course cutoff' });
  }
};

// Apply for course
exports.applyCourse = async (req, res) => {
  try {
    const userId = req.userId;
    const { faculty_id, comments,course_id } = req.body;

    // Get student profile
    const [students] = await db.query(
      'SELECT * FROM student_profile WHERE user_id = ?',
      [userId]
    );

    if (students.length === 0) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const studentId = students[0].student_id;

    // Check if already applied
    const [existingApplications] = await db.query(
      'SELECT * FROM course_applications WHERE student_id = ? AND course_id = ?',
      [studentId, course_id]
    );

    if (existingApplications.length > 0) {
      return res.status(400).json({ message: 'You have already applied to this course' });
    }

    // Insert application
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    await db.query(
      'INSERT INTO course_applications (student_id, course_id, faculty_id, application_date, status, comments) VALUES (?, ?, ?, ?, ?, ?)',
      [studentId, course_id, faculty_id, currentDate, 'pending', comments]
    );

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error submitting application' });
  }
};

// Get student applications
exports.getStudentApplications = async (req, res) => {
  try {
    const userId = req.userId;
    // Get student profile
    const [students] = await db.query(
      'SELECT * FROM student_profile WHERE user_id = ?',
      [userId]
    );

    if (students.length === 0) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    const studentId = students[0].student_id;

    // Get applications
    const [applications] = await db.query(
      `SELECT a.*, c.course_name, c.fee, cm.college_name, f.department, u.username as faculty_name
       FROM course_applications a
       JOIN college_courses_details c ON a.course_id = c.course_id
       JOIN college_master_details cm ON c.college_id = cm.college_id
       JOIN college_faculty_details f ON a.faculty_id = f.faculty_id
       JOIN user u ON f.user_id = u.user_id
       WHERE a.student_id = ?`,
      [studentId]
    );

    res.status(200).json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

// Get faculty applications
exports.getFacultyApplications = async (req, res) => {
  try {
    const userId = req.userId;

    // Get faculty profile
    const [faculty] = await db.query(
      'SELECT * FROM college_faculty_details WHERE user_id = ?',
      [userId]
    );

    if (faculty.length === 0) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }

    const facultyId = faculty[0].faculty_id;

    // Get applications
    const [applications] = await db.query(
      `SELECT a.*, c.course_name, s.user_id, u.username as student_name, u.email as student_email
       FROM course_applications a
       JOIN college_courses_details c ON a.course_id = c.course_id
       JOIN student_profile s ON a.student_id = s.student_id
       JOIN user u ON s.user_id = u.user_id
       WHERE a.faculty_id = ?`,
      [facultyId]
    );

    res.status(200).json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching applications' });
  }
};

// Get course applications (for institute)
exports.getCourseApplications = async (req, res) => {
  try {
    const collegeId = req.params.collegeId;
    const courses=await db.query(
      'SELECT course_id FROM college_courses_details WHERE college_id = ?',
      [collegeId]
    );
    console.log(courses);
    const applications=[];
    for (const course of courses[0]) {
      const [courseApplications] = await db.query(
        `SELECT a.*, c.course_name, s.user_id, u.username as student_name, u.email as student_email
         FROM course_applications a
         JOIN college_courses_details c ON a.course_id = c.course_id
         JOIN student_profile s ON a.student_id = s.student_id
         JOIN user u ON s.user_id = u.user_id
         WHERE a.course_id = ?`,
        [course.course_id]
      );
      applications.push(...courseApplications);
    }
    // Verify ownership
    res.status(200).json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching course applications' });
  }
};
