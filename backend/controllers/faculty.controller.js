const db = require('../config/db.config');
const Joi = require('joi');

// Validation schema for faculty profile
const facultyProfileSchema = Joi.object({
  collegeId: Joi.number().integer().required(),
  department: Joi.string().required(),
  qualification: Joi.string().required(),
  researchArea: Joi.string().allow(''),
  contactEmail: Joi.string().email().required(),
  publications: Joi.string().allow(''),
  experience: Joi.number().integer().min(0).allow(null)
});

// Create faculty profile
exports.createProfile = async (req, res) => {
  try {
    const { error } = facultyProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.userId;

    // Check if profile already exists
    const [existingProfiles] = await db.query(
      'SELECT * FROM college_faculty_details WHERE user_id = ?',
      [userId]
    );

    if (existingProfiles.length > 0) {
      return res.status(400).json({ message: 'Faculty profile already exists' });
    }

    const {
      collegeId,
      department,
      qualification,
      researchArea,
      contactEmail,
      publications,
      experience
    } = req.body;

    // Verify college exists
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ?',
      [collegeId]
    );

    if (colleges.length === 0) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Insert profile
    const [result] = await db.query(
      `INSERT INTO college_faculty_details 
      (user_id, college_id, department, qualification, research_area, contact_email, publications, experience) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        collegeId,
        department,
        qualification,
        researchArea,
        contactEmail,
        publications,
        experience
      ]
    );

    res.status(201).json({
      message: 'Faculty profile created successfully',
      facultyId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating faculty profile' });
  }
};

// Get faculty profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const [profiles] = await db.query(
      `SELECT f.*, c.college_name 
       FROM college_faculty_details f
       JOIN college_master_details c ON f.college_id = c.college_id
       WHERE f.user_id = ?`,
      [userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }

    res.status(200).json({ profile: profiles[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching faculty profile' });
  }
};

// Update faculty profile
exports.updateProfile = async (req, res) => {
  try {
    const { error } = facultyProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.userId;
    const {
      collegeId,
      department,
      qualification,
      researchArea,
      contactEmail,
      publications,
      experience
    } = req.body;

    // Check if profile exists
    const [profiles] = await db.query(
      'SELECT * FROM college_faculty_details WHERE user_id = ?',
      [userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }

    // Update profile
    await db.query(
      `UPDATE college_faculty_details SET
      college_id = ?,
      department = ?,
      qualification = ?,
      research_area = ?,
      contact_email = ?,
      publications = ?,
      experience = ?
      WHERE user_id = ?`,
      [
        collegeId,
        department,
        qualification,
        researchArea,
        contactEmail,
        publications,
        experience,
        userId
      ]
    );

    res.status(200).json({ message: 'Faculty profile updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating faculty profile' });
  }
};

// Get faculty applications
exports.getApplications = async (req, res) => {
  try {
    const userId = req.userId;

    // Get faculty ID
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
      `SELECT a.*, c.course_name, 
        s.entrance_exam_percentile, s.category, s.stream,
        u.username as student_name, u.email as student_email
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

// Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const userId = req.userId;
    const { status, comments } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Get faculty ID
    const [faculty] = await db.query(
      'SELECT * FROM college_faculty_details WHERE user_id = ?',
      [userId]
    );

    if (faculty.length === 0) {
      return res.status(404).json({ message: 'Faculty profile not found' });
    }

    const facultyId = faculty[0].faculty_id;

    // Check if application belongs to this faculty
    const [applications] = await db.query(
      'SELECT * FROM course_applications WHERE application_id = ? AND faculty_id = ?',
      [applicationId, facultyId]
    );

    if (applications.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this application' });
    }

    // Update application
    await db.query(
      'UPDATE course_applications SET status = ?, comments = ? WHERE application_id = ?',
      [status, comments, applicationId]
    );

    res.status(200).json({ message: 'Application status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating application status' });
  }
};

// Faculty invitation schema
const facultyInvitationSchema = Joi.object({
  email: Joi.string().email().required(),
  department: Joi.string().required(),
  collegeId: Joi.number().integer().required(),
  role: Joi.string().allow(null, '')
});

// Invite faculty
exports.inviteFaculty = async (req, res) => {
  try {
    const { error } = facultyInvitationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.userId;
    const { email, department, collegeId, role } = req.body;

    // Verify college ownership
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ? AND user_id = ?',
      [collegeId, userId]
    );

    if (colleges.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to invite faculty for this college' });
    }

    // Check if user with this email exists
    const [users] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    const userExists = users.length > 0;
    
    // Check if invitation already exists
    const [existingInvitations] = await db.query(
      'SELECT * FROM faculty_invitations WHERE email = ? AND college_id = ? AND status = "pending"',
      [email, collegeId]
    );

    if (existingInvitations.length > 0) {
      return res.status(400).json({ message: 'An invitation has already been sent to this email' });
    }

    // Insert invitation
    const [result] = await db.query(
      `INSERT INTO faculty_invitations 
      (college_id, email, department, role, status, created_at) 
      VALUES (?, ?, ?, ?, 'pending', NOW())`,
      [collegeId, email, department, role || null]
    );

    // If user exists, send notification (in a real app)
    // For now, just return success
    res.status(201).json({
      message: 'Faculty invitation sent successfully',
      invitationId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending faculty invitation' });
  }
};

// Get college's faculty invitations
exports.getCollegeInvitations = async (req, res) => {
  try {
    const collegeId = req.params.collegeId;
    const userId = req.userId;

    // Verify college ownership
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ? AND user_id = ?',
      [collegeId, userId]
    );

    if (colleges.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to view invitations for this college' });
    }

    // Get invitations
    const [invitations] = await db.query(
      `SELECT i.*, c.college_name 
       FROM faculty_invitations i
       JOIN college_master_details c ON i.college_id = c.college_id
       WHERE i.college_id = ?
       ORDER BY i.created_at DESC`,
      [collegeId]
    );

    res.status(200).json({ invitations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching faculty invitations' });
  }
};

// Get faculty invitations by email
exports.getFacultyInvitations = async (req, res) => {
  try {
    const email = req.params.email;
    
    // Get invitations for this email
    const [invitations] = await db.query(
      `SELECT i.*, c.college_name 
       FROM faculty_invitations i
       JOIN college_master_details c ON i.college_id = c.college_id
       WHERE i.email = ? AND i.status = 'pending'
       ORDER BY i.created_at DESC`,
      [email]
    );

    res.status(200).json({ invitations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching faculty invitations' });
  }
};

// Respond to invitation
exports.respondToInvitation = async (req, res) => {
  try {
    const invitationId = req.params.id;
    const { accept } = req.body;
    
    if (typeof accept !== 'boolean') {
      return res.status(400).json({ message: 'The accept parameter must be a boolean' });
    }

    // Get invitation
    const [invitations] = await db.query(
      'SELECT * FROM faculty_invitations WHERE invitation_id = ?',
      [invitationId]
    );

    if (invitations.length === 0) {
      return res.status(404).json({ message: 'Invitation not found' });
    }

    const invitation = invitations[0];

    // Update invitation status
    await db.query(
      'UPDATE faculty_invitations SET status = ? WHERE invitation_id = ?',
      [accept ? 'accepted' : 'rejected', invitationId]
    );

    res.status(200).json({ 
      message: accept ? 'Invitation accepted' : 'Invitation rejected',
      collegeId: invitation.college_id,
      department: invitation.department
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error responding to invitation' });
  }
};
