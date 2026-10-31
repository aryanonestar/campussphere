const User = require('../models/User');
const Course = require('../models/Course');

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('enrolledCourses');

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.json(user);
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const { name, email, password } = req.body;

  if (name) user.name = name;
  if (email) user.email = email;
  if (password) user.password = password;

  const updatedUser = await user.save();

  return res.json({
    message: 'Profile updated successfully.',
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      enrolledCourses: updatedUser.enrolledCourses,
    },
  });
};

const enrollCourse = async (req, res) => {
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required.' });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const alreadyEnrolled = user.enrolledCourses.some((id) => id.toString() === courseId);
  if (alreadyEnrolled) {
    return res.status(400).json({ message: 'You are already enrolled in this course.' });
  }

  user.enrolledCourses.push(courseId);
  await user.save();

  const updatedUser = await User.findById(req.user._id)
    .select('-password')
    .populate('enrolledCourses');

  return res.json({
    message: 'Course enrolled successfully.',
    user: updatedUser,
  });
};

const getAllStudents = async (req, res) => {
  const students = await User.find({ role: 'student' })
    .select('-password')
    .populate('enrolledCourses');

  return res.json(students);
};

const assignCourseToStudent = async (req, res) => {
  const { userId, courseId } = req.body;

  const user = await User.findOne({ _id: userId, role: 'student' });
  if (!user) {
    return res.status(404).json({ message: 'Student not found.' });
  }

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  const alreadyAssigned = user.enrolledCourses.some((id) => id.toString() === courseId);
  if (alreadyAssigned) {
    return res.status(400).json({ message: 'Course already assigned to this student.' });
  }

  user.enrolledCourses.push(courseId);
  await user.save();

  const updatedStudent = await User.findById(userId)
    .select('-password')
    .populate('enrolledCourses');

  return res.json({
    message: 'Course assigned successfully.',
    student: updatedStudent,
  });
};

const getAdminAnalytics = async (req, res) => {
  const [totalStudents, totalCourses, recentStudents] = await Promise.all([
    User.countDocuments({ role: 'student' }),
    Course.countDocuments(),
    User.find({ role: 'student' })
      .select('name email enrolledCourses createdAt')
      .populate('enrolledCourses')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  return res.json({
    totalStudents,
    totalCourses,
    recentStudents,
  });
};

module.exports = {
  getProfile,
  updateProfile,
  enrollCourse,
  getAllStudents,
  assignCourseToStudent,
  getAdminAnalytics,
};

