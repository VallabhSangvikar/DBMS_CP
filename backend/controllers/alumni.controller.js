const db = require('../config/db.config');
const Joi = require('joi');

// Validation schema for alumni
const alumniSchema = Joi.object({
  collegeId: Joi.number().integer().required(),
  name: Joi.string().required(),
  graduationYear: Joi.number().integer().min(1950).max(new Date().getFullYear()).required(),
  degree: Joi.string().required(),
  currentCompany: Joi.string().allow(null, ''),
  designation: Joi.string().allow(null, ''),
  package: Joi.number().precision(2).allow(null),
  achievements: Joi.string().allow(null, ''),
  linkedinProfile: Joi.string().uri().allow(null, ''),
  contactEmail: Joi.string().email().allow(null, '')
});

// Get all alumni
exports.getAllAlumni = async (req, res) => {
  try {
    const collegeId = req.query.collegeId;
    let query = 'SELECT * FROM college_alumni_details';
    let params = [];
    
    if (collegeId) {
      query += ' WHERE college_id = ?';
      params.push(collegeId);
    }
    
    const [alumni] = await db.query(query, params);
    res.status(200).json({ alumni });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching alumni' });
  }
};

// Get alumni by ID
exports.getAlumniById = async (req, res) => {
  try {
    const alumniId = req.params.id;
    const [alumni] = await db.query(
      'SELECT * FROM college_alumni_details WHERE alumni_id = ?',
      [alumniId]
    );

    if (alumni.length === 0) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.status(200).json({ alumnus: alumni[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching alumni details' });
  }
};

// Get notable alumni for a college
exports.getNotableAlumni = async (req, res) => {
  try {
    const collegeId = req.params.collegeId;
    const [alumni] = await db.query(
      'SELECT * FROM college_alumni_details WHERE college_id = ? ORDER BY package DESC LIMIT 5',
      [collegeId]
    );

    res.status(200).json({ alumni });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notable alumni' });
  }
};

// Create alumni
exports.createAlumni = async (req, res) => {
  try {
    // const { error } = alumniSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }

    const userId = req.userId;
    const { 
      college_id, 
      name, 
      graduation_year, 
      degree, 
      current_company, 
      designation, 
      package, 
      achievements, 
      linkedin_profile, 
      contact_email 
    } = req.body;

    // Verify college ownership
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ? AND user_id = ?',
      [college_id, userId]
    );

    if (colleges.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to add alumni to this college' });
    }

    const [result] = await db.query(
      `INSERT INTO college_alumni_details 
       (college_id, name, graduation_year, degree, current_company, designation, package, achievements, linkedin_profile, contact_email) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [college_id, name, graduation_year, degree, current_company, designation, package, achievements, linkedin_profile, contact_email]
    );

    res.status(201).json({ 
      message: 'Alumni created successfully', 
      alumniId: result.insertId 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating alumni record' });
  }
};

// Update alumni
exports.updateAlumni = async (req, res) => {
  try {
    const alumniId = req.params.id;
    const userId = req.userId;
    // const { error } = alumniSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }

    const { 
      college_id, 
      name, 
      graduation_year, 
      degree, 
      current_company, 
      designation, 
      package, 
      achievements, 
      linkedin_profile, 
      contact_email 
    } = req.body;

    // Verify ownership
    const [alumni] = await db.query(
      `SELECT a.* FROM college_alumni_details a
       JOIN college_master_details c ON a.college_id = c.college_id
       WHERE a.alumni_id = ? AND c.user_id = ?`,
      [alumniId, userId]
    );

    if (alumni.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this alumni record' });
    }

    await db.query(
      `UPDATE college_alumni_details SET 
       college_id = ?, name = ?, graduation_year = ?, degree = ?, 
       current_company = ?, designation = ?, package = ?, 
       achievements = ?, linkedin_profile = ?, contact_email = ? 
       WHERE alumni_id = ?`,
      [college_id, name, graduation_year, degree, current_company, designation, package, achievements, linkedin_profile, contact_email, alumniId]
    );

    res.status(200).json({ message: 'Alumni updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating alumni record' });
  }
};

// Delete alumni
exports.deleteAlumni = async (req, res) => {
  try {
    const alumniId = req.params.id;
    const userId = req.userId;

    // Verify ownership
    const [alumni] = await db.query(
      `SELECT a.* FROM college_alumni_details a
       JOIN college_master_details c ON a.college_id = c.college_id
       WHERE a.alumni_id = ? AND c.user_id = ?`,
      [alumniId, userId]
    );

    if (alumni.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to delete this alumni record' });
    }

    await db.query('DELETE FROM college_alumni_details WHERE alumni_id = ?', [alumniId]);

    res.status(200).json({ message: 'Alumni deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting alumni record' });
  }
};
