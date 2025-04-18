const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { verifyToken, isStudent } = require('../middleware/auth.middleware');

// Protected routes
router.post('/profile', verifyToken, isStudent, studentController.createProfile);
router.get('/profile', verifyToken, isStudent, studentController.getProfile);
router.put('/profile', verifyToken, isStudent, studentController.updateProfile);

// College verification
router.put('/verify', verifyToken, studentController.verifyStudentByEmail);

// College comparison
router.get('/compare-colleges', verifyToken, isStudent, studentController.compareColleges);

module.exports = router;
