const Course = require('../models/Course');

const getCourses = async (req, res) => {
  const courses = await Course.find().sort({ createdAt: -1 });
  return res.json(courses);
};

const createCourse = async (req, res) => {
  const { title, description, instructor, duration } = req.body;

  if (!title || !description || !instructor || !duration) {
    return res.status(400).json({ message: 'All course fields are required.' });
  }

  const course = await Course.create({
    title,
    description,
    instructor,
    duration,
  });

  return res.status(201).json({
    message: 'Course created successfully.',
    course,
  });
};

const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  const { title, description, instructor, duration } = req.body;

  course.title = title ?? course.title;
  course.description = description ?? course.description;
  course.instructor = instructor ?? course.instructor;
  course.duration = duration ?? course.duration;

  const updatedCourse = await course.save();

  return res.json({
    message: 'Course updated successfully.',
    course: updatedCourse,
  });
};

const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  await course.deleteOne();

  return res.json({ message: 'Course deleted successfully.' });
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};

