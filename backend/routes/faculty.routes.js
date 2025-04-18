const express = require('express');
const router = express.Router();
const facultyController = require('../controllers/faculty.controller');
const { verifyToken, isFaculty, isInstitute } = require('../middleware/auth.middleware');

// Protected routes
router.post('/profile', verifyToken, isFaculty, facultyController.createProfile);
router.get('/profile', verifyToken, isFaculty, facultyController.getProfile);
router.put('/profile', verifyToken, isFaculty, facultyController.updateProfile);

// Applications
router.get('/applications', verifyToken, isFaculty, facultyController.getApplications);
router.put('/applications/:id', verifyToken, isFaculty, facultyController.updateApplicationStatus);

// Faculty invitation routes
router.post('/invite', verifyToken, isInstitute, facultyController.inviteFaculty);
router.get('/invitations/:collegeId', verifyToken, isInstitute, facultyController.getCollegeInvitations);
router.get('/invitations/email/:email', verifyToken, facultyController.getFacultyInvitations);
router.put('/invitation/:id', verifyToken, facultyController.respondToInvitation);

module.exports = router;
