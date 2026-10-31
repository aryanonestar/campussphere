const express = require('express');
const {
  getProfile,
  updateProfile,
  enrollCourse,
  getAllStudents,
  assignCourseToStudent,
  getAdminAnalytics,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/update', protect, updateProfile);
router.post('/enroll', protect, authorize('student'), enrollCourse);
router.get('/students', protect, authorize('admin'), getAllStudents);
router.post('/assign-course', protect, authorize('admin'), assignCourseToStudent);
router.get('/analytics', protect, authorize('admin'), getAdminAnalytics);

module.exports = router;

