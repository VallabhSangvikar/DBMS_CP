const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumni.controller');
const { verifyToken, isInstitute } = require('../middleware/auth.middleware');

// Public routes
router.get('/', alumniController.getAllAlumni);
router.get('/:id', alumniController.getAlumniById);
router.get('/notable/:collegeId', alumniController.getNotableAlumni);

// Protected routes
router.post('/', verifyToken, isInstitute, alumniController.createAlumni);
router.put('/:id', verifyToken, isInstitute, alumniController.updateAlumni);
router.delete('/:id', verifyToken, isInstitute, alumniController.deleteAlumni);

module.exports = router;
