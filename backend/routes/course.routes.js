const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { verifyToken, isInstitute, isStudent } = require('../middleware/auth.middleware');

// Public routes
router.get('/applications/:collegeId', verifyToken, isInstitute, courseController.getCourseApplications);
router.get('/', courseController.getAllCourses);

router.get('/student-applications', verifyToken, isStudent, courseController.getStudentApplications);
router.get('/:id', courseController.getCourseById);
router.get('/:id/cutoffs', courseController.getCourseCutoffs);

// Protected routes - Institute only
router.post('/', verifyToken, isInstitute, courseController.createCourse);
router.put('/:id', verifyToken, isInstitute, courseController.updateCourse);
router.delete('/:id', verifyToken, isInstitute, courseController.deleteCourse);

// Cutoff management - Institute only
router.post('/cutoff', verifyToken, isInstitute, courseController.createCourseCutoff);
router.put('/cutoff/:id', verifyToken, isInstitute, courseController.updateCourseCutoff);
router.delete('/cutoff/:id', verifyToken, isInstitute, courseController.deleteCourseCutoff);

// Application routes - Student only
router.post('/apply', verifyToken, isStudent, courseController.applyCourse);

// Institute application routes


module.exports = router;
