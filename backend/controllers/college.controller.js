const db = require('../config/db.config');
const Joi = require('joi');

// Validation schema for creating college
const collegeSchema = Joi.object({
  collegeName: Joi.string().required(),
  establishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
  accreditation: Joi.string().required(),
  locationState: Joi.string().required(),
  city: Joi.string().required(),
  campusSize: Joi.number().precision(2).required(),
  contactEmail: Joi.string().email().required(),
  contactPhone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
  websiteUrl: Joi.string().uri().required(),
  emailDomain: Joi.string().required()
});

// Validation schema for placement data
const placementSchema = Joi.object({
  college_id: Joi.number().integer().required(),
  year: Joi.number().integer().min(2000).max(new Date().getFullYear()).required(),
  company_name: Joi.string().required(),
  students_placed: Joi.number().integer().min(1).required(),
  average_salary: Joi.number().precision(2).min(0).required(),
  highest_salary: Joi.number().precision(2).min(0).required(),
  sector: Joi.string().required()
});

// Get all colleges
exports.getAllColleges = async (req, res) => {
  try {
    const [colleges] = await db.query('SELECT * FROM college_master_details');
    res.status(200).json({ colleges });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching colleges' });
  }
};
exports.getCollegeProfile = async (req, res) => {
  try{
    const userId = req.userId;
    const [colleges] = await db.query('SELECT * FROM college_master_details WHERE user_id = ?', [userId]);
    if (colleges.length === 0) {
      return res.status(404).json({ message: 'College not found' });
    }
    res.status(200).json({ college: colleges[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching college profile' });
  }
  }
// Get college by ID
exports.getCollegeById = async (req, res) => {
  try {
    const collegeId = req.params.id;

    const [colleges] = await db.query('SELECT * FROM college_master_details WHERE college_id = ?', [collegeId]);

    if (colleges.length === 0) {
      return res.status(404).json({ message: 'College not found' });
    }

    res.status(200).json({ college: colleges[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching college details' });
  }
};

// Create new college
exports.createCollege = async (req, res) => {
  try {
    const { error } = collegeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.userId;
    const {
      collegeName,
      establishedYear,
      accreditation,
      locationState,
      city,
      campusSize,
      contactEmail,
      contactPhone,
      websiteUrl,
      emailDomain
    } = req.body;

    // Check if this user already has a college
    const [existingColleges] = await db.query(
      'SELECT * FROM college_master_details WHERE user_id = ?',
      [userId]
    );

    if (existingColleges.length > 0) {
      return res.status(400).json({ message: 'This user already has a registered college' });
    }

    // Insert college
    const [result] = await db.query(
      `INSERT INTO college_master_details 
      (user_id, college_name, established_year, accreditation, location_state, city, campus_size, contact_email, contact_phone, website_url, email_domain) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        collegeName,
        establishedYear,
        accreditation,
        locationState,
        city,
        campusSize,
        contactEmail,
        contactPhone,
        websiteUrl,
        emailDomain
      ]
    );

    res.status(201).json({
      message: 'College registered successfully',
      collegeId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating college' });
  }
};

// Update college
exports.updateCollege = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const userId = req.userId;

    // Verify ownership
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ? AND user_id = ?',
      [collegeId, userId]
    );

    if (colleges.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this college' });
    }

    const {
      collegeName,
      establishedYear,
      accreditation,
      locationState,
      city,
      campusSize,
      contactEmail,
      contactPhone,
      websiteUrl,
      emailDomain
    } = req.body;

    // Update college
    await db.query(
      `UPDATE college_master_details SET
      college_name = ?, 
      established_year = ?, 
      accreditation = ?, 
      location_state = ?, 
      city = ?, 
      campus_size = ?, 
      contact_email = ?, 
      contact_phone = ?, 
      website_url = ?,
      email_domain = ?
      WHERE college_id = ?`,
      [
        collegeName,
        establishedYear,
        accreditation,
        locationState,
        city,
        campusSize,
        contactEmail,
        contactPhone,
        websiteUrl,
        emailDomain,
        collegeId
      ]
    );

    res.status(200).json({ message: 'College updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating college' });
  }
};

// Delete college
exports.deleteCollege = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const userId = req.userId;

    // Verify ownership
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ? AND user_id = ?',
      [collegeId, userId]
    );

    if (colleges.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to delete this college' });
    }

    // Delete college
    await db.query('DELETE FROM college_master_details WHERE college_id = ?', [collegeId]);

    res.status(200).json({ message: 'College deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting college' });
  }
};

// Get college courses
exports.getCollegeCourses = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const [courses] = await db.query(
      'SELECT * FROM college_courses_details WHERE college_id = ?',
      [collegeId]
    );

    res.status(200).json({ courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching college courses' });
  }
};

// Get college infrastructure
exports.getCollegeInfrastructure = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const [infrastructure] = await db.query(
      'SELECT * FROM college_infrastructure_details WHERE college_id = ?',
      [collegeId]
    );

    if (infrastructure.length === 0) {
      return res.status(404).json({ message: 'Infrastructure details not found' });
    }

    res.status(200).json({ infrastructure: infrastructure[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching college infrastructure' });
  }
};

// Create college infrastructure
exports.createCollegeInfrastructure = async (req, res) => {
  try {
    const userId = req.userId;
    const { collegeId, hostel, library, lab, sports, digitalLearningResources } = req.body;

    // Verify ownership
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ? AND user_id = ?',
      [collegeId, userId]
    );

    if (colleges.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this college' });
    }

    // Check if infrastructure already exists
    const [existingInfrastructure] = await db.query(
      'SELECT * FROM college_infrastructure_details WHERE college_id = ?',
      [collegeId]
    );

    if (existingInfrastructure.length > 0) {
      return res.status(400).json({ 
        message: 'Infrastructure details already exist for this college. Use update endpoint.' 
      });
    }

    // Insert infrastructure
    await db.query(
      `INSERT INTO college_infrastructure_details 
      (college_id, hostel, library, lab, sports, digital_learning_resources) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [collegeId, hostel ? 1 : 0, library ? 1 : 0, lab ? 1 : 0, sports ? 1 : 0, digitalLearningResources ? 1 : 0]
    );

    res.status(201).json({ message: 'Infrastructure details created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating infrastructure details' });
  }
};

// Update college infrastructure
exports.updateCollegeInfrastructure = async (req, res) => {
  try {
    const userId = req.userId;
    const { collegeId, hostel, library, lab, sports, digitalLearningResources } = req.body;

    // Verify ownership
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ? AND user_id = ?',
      [collegeId, userId]
    );

    if (colleges.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this college' });
    }

    // Update infrastructure
    await db.query(
      `UPDATE college_infrastructure_details SET
      hostel = ?, 
      library = ?, 
      lab = ?, 
      sports = ?, 
      digital_learning_resources = ?
      WHERE college_id = ?`,
      [hostel ? 1 : 0, library ? 1 : 0, lab ? 1 : 0, sports ? 1 : 0, digitalLearningResources ? 1 : 0, collegeId]
    );

    res.status(200).json({ message: 'Infrastructure details updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating infrastructure details' });
  }
};

// Get college faculty
exports.getCollegeFaculty = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const [faculty] = await db.query(
      `SELECT f.*, u.username
       FROM college_faculty_details f
       JOIN user u ON f.user_id = u.user_id
       WHERE f.college_id = ?`,
      [collegeId]
    );

    res.status(200).json({ faculty });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching college faculty' });
  }
};

// Get college placement
exports.getCollegePlacement = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const [placements] = await db.query(
      'SELECT * FROM college_placement_details WHERE college_id = ?',
      [collegeId]
    );

    res.status(200).json({ placements });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching college placements' });
  }
};

// Create college placement record
exports.createPlacement = async (req, res) => {
  try {
    // const { error } = placementSchema.validate(req.body);
    // if (error) {
    //   return res.status(400).json({ message: error.details[0].message });
    // }

    const userId = req.userId;
    const {
      college_id,
      year,
      company_name,
      students_placed,
      average_salary,
      highest_salary,
      sector
    } = req.body;

    // Verify college ownership
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ? AND user_id = ?',
      [college_id, userId]
    );

    if (colleges.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to add placement data for this college' });
    }

    // Insert placement record
    const [result] = await db.query(
      `INSERT INTO college_placement_details 
      (college_id, academic_year, top_recruiters, total_students_placed, average_package, highest_package,placement_percentage) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [college_id, year, company_name, students_placed, average_salary, highest_salary,92.5]
    );

    res.status(201).json({
      message: 'Placement record created successfully',
      placementId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating placement record' });
  }
};

// Update placement record
exports.updatePlacement = async (req, res) => {
  try {
    const placementId = req.params.id;
    const userId = req.userId;
    const {
      college_id,
      year,
      company_name,
      students_placed,
      average_salary,
      highest_salary,
      sector
    } = req.body;


    // Verify ownership
    const [placements] = await db.query(
      `SELECT p.* FROM college_placement_details p
       JOIN college_master_details c ON p.college_id = c.college_id
       WHERE p.placement_id = ? AND c.user_id = ?`,
      [placementId, userId]
    );

    if (placements.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this placement record' });
    }

    // Update placement record
    await db.query(
      `UPDATE college_placement_details SET
       academic_year = ?,
       top_recruiters = ?,
       total_students_placed = ?,
       average_package = ?,
       highest_package = ?,
       sector = ?
       WHERE placement_id = ?`,
      [year, company_name, students_placed, average_salary, highest_salary, sector, placementId]
    );

    res.status(200).json({ message: 'Placement record updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating placement record' });
  }
};

// Delete placement record
exports.deletePlacement = async (req, res) => {
  try {
    const placementId = req.params.id;
    const userId = req.userId;

    // Verify ownership
    const [placements] = await db.query(
      `SELECT p.* FROM college_placement_details p
       JOIN college_master_details c ON p.college_id = c.college_id
       WHERE p.placement_id = ? AND c.user_id = ?`,
      [placementId, userId]
    );

    if (placements.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to delete this placement record' });
    }

    // Delete placement record
    await db.query('DELETE FROM college_placement_details WHERE placement_id = ?', [placementId]);

    res.status(200).json({ message: 'Placement record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting placement record' });
  }
};

// Get college scholarships
exports.getCollegeScholarships = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const [scholarships] = await db.query(
      'SELECT * FROM college_scholarship_details WHERE college_id = ?',
      [collegeId]
    );

    res.status(200).json({ scholarships });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching college scholarships' });
  }
};

// Validation schema for scholarship data
const scholarshipSchema = Joi.object({
  collegeId: Joi.number().integer().required(),
  name: Joi.string().required(),
  description: Joi.string().required(),
  eligibilityCriteria: Joi.string().required(),
  amount: Joi.number().precision(2).min(0).required(),
  applicationProcess: Joi.string().required(),
  deadline: Joi.string().required()
});

// Create college scholarship
exports.createScholarship = async (req, res) => {
  try {
    const { error } = scholarshipSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const userId = req.userId;
    const {
      collegeId,
      name,
      description,
      eligibilityCriteria,
      amount,
      applicationProcess,
      deadline
    } = req.body;

    // Verify college ownership
    const [colleges] = await db.query(
      'SELECT * FROM college_master_details WHERE college_id = ? AND user_id = ?',
      [collegeId, userId]
    );

    if (colleges.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to add scholarships for this college' });
    }

    // Insert scholarship
    const [result] = await db.query(
      `INSERT INTO college_scholarship_details 
      (college_id, name, description, eligibility_criteria, amount, application_process, deadline) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [collegeId, name, description, eligibilityCriteria, amount, applicationProcess, deadline]
    );

    res.status(201).json({
      message: 'Scholarship created successfully',
      scholarshipId: result.insertId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating scholarship' });
  }
};

// Update scholarship
exports.updateScholarship = async (req, res) => {
  try {
    const scholarshipId = req.params.id;
    const userId = req.userId;
    const {
      name,
      description,
      eligibilityCriteria,
      amount,
      applicationProcess,
      deadline
    } = req.body;

    // Verify ownership
    const [scholarships] = await db.query(
      `SELECT s.* FROM college_scholarship_details s
       JOIN college_master_details c ON s.college_id = c.college_id
       WHERE s.scholarship_id = ? AND c.user_id = ?`,
      [scholarshipId, userId]
    );

    if (scholarships.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to update this scholarship' });
    }

    // Update scholarship
    await db.query(
      `UPDATE college_scholarship_details SET
       name = ?,
       description = ?,
       eligibility_criteria = ?,
       amount = ?,
       application_process = ?,
       deadline = ?
       WHERE scholarship_id = ?`,
      [name, description, eligibilityCriteria, amount, applicationProcess, deadline, scholarshipId]
    );

    res.status(200).json({ message: 'Scholarship updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating scholarship' });
  }
};

// Delete scholarship
exports.deleteScholarship = async (req, res) => {
  try {
    const scholarshipId = req.params.id;
    const userId = req.userId;

    // Verify ownership
    const [scholarships] = await db.query(
      `SELECT s.* FROM college_scholarship_details s
       JOIN college_master_details c ON s.college_id = c.college_id
       WHERE s.scholarship_id = ? AND c.user_id = ?`,
      [scholarshipId, userId]
    );

    if (scholarships.length === 0) {
      return res.status(403).json({ message: 'You do not have permission to delete this scholarship' });
    }

    // Delete scholarship
    await db.query('DELETE FROM college_scholarship_details WHERE scholarship_id = ?', [scholarshipId]);

    res.status(200).json({ message: 'Scholarship deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting scholarship' });
  }
};

// Get college alumni
exports.getCollegeAlumni = async (req, res) => {
  try {
    const collegeId = req.params.id;
    const [alumni] = await db.query(
      `SELECT *
       FROM college_alumni_details 
       WHERE college_id = ?`,
      [collegeId]
    );

    res.status(200).json({ alumni });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching college alumni' });
  }
};
