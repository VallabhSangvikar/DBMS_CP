const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/college.controller');
const { verifyToken, isInstitute } = require('../middleware/auth.middleware');

// Public college routes
router.get('/', collegeController.getAllColleges);
router.get("/profile",verifyToken,isInstitute, collegeController.getCollegeProfile);
router.get('/:id' ,collegeController.getCollegeById);
router.get('/:id/courses', collegeController.getCollegeCourses);
router.get('/:id/faculty', collegeController.getCollegeFaculty);
router.get('/:id/placement', collegeController.getCollegePlacement);
router.get('/:id/infrastructure', collegeController.getCollegeInfrastructure);
router.get('/:id/scholarships', collegeController.getCollegeScholarships);
router.get('/:id/alumni', collegeController.getCollegeAlumni);

// Protected routes
router.put('/infrastructure', verifyToken, isInstitute, collegeController.updateCollegeInfrastructure);
router.post('/', verifyToken, isInstitute, collegeController.createCollege);
router.put('/:id', verifyToken, isInstitute, collegeController.updateCollege);
router.delete('/:id', verifyToken, isInstitute, collegeController.deleteCollege);

// Infrastructure management
router.post('/infrastructure', verifyToken, isInstitute, collegeController.createCollegeInfrastructure);


// Placement management
router.post('/placement', verifyToken, isInstitute, collegeController.createPlacement);
router.put('/placement/:id', verifyToken, isInstitute, collegeController.updatePlacement);
router.delete('/placement/:id', verifyToken, isInstitute, collegeController.deletePlacement);

// Scholarship management
router.post('/scholarship', verifyToken, isInstitute, collegeController.createScholarship);
router.put('/scholarship/:id', verifyToken, isInstitute, collegeController.updateScholarship);
router.delete('/scholarship/:id', verifyToken, isInstitute, collegeController.deleteScholarship);

module.exports = router;
