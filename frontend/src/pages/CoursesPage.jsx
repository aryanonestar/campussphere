import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Search, SlidersHorizontal, Sparkles, Users2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import CourseCard from '../components/CourseCard';
import CertificateModal from '../components/CertificateModal';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

// ── All distinct categories and levels in the seeded catalog ──────────────
const CATEGORIES = [
  'All',
  'Design',
  'Artificial Intelligence',
  'Infrastructure',
  'Analytics',
  'Security',
  'Leadership',
  'Software Engineering',
  'Computer Science',
  'Programming',
  'Language',
];
const LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'rating', label: 'Top rated' },
  { value: 'az', label: 'A → Z' },
];

const initialCourseForm = {
  title: '',
  description: '',
  instructor: '',
  duration: '',
  category: '',
  level: '',
  image: '',
  lessons: '',
  seats: '',
  rating: '',
  playlistId: '',
};

const CoursesPage = () => {
  const { user, refreshProfile } = useAuth();
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterLevel, setFilterLevel] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState(initialCourseForm);
  const [assignment, setAssignment] = useState({ userId: '', courseId: '' });
  // Certificate modal state
  const [certModal, setCertModal] = useState({ open: false, course: null });

  const isAdmin = user?.role === 'admin';

  const fetchCourses = async () => {
    const { data } = await api.get('/courses');
    setCourses(data);
    return data;
  };

  const fetchStudents = async () => {
    if (!isAdmin) return;
    const { data } = await api.get('/users/students');
    setStudents(data);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchCourses(), fetchStudents()]);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAdmin]);

  const filteredCourses = useMemo(() => {
    const term = search.toLowerCase();
    let result = courses.filter((course) => {
      const matchesSearch = [
        course.title, course.description, course.instructor,
        course.duration, course.category, course.level,
      ].join(' ').toLowerCase().includes(term);
      const matchesCategory = filterCategory === 'All' || course.category === filterCategory;
      const matchesLevel = filterLevel === 'All' || course.level === filterLevel;
      return matchesSearch && matchesCategory && matchesLevel;
    });

    if (sortBy === 'rating') result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'az') result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    // 'newest' is already the default order from the API

    return result;
  }, [courses, search, filterCategory, filterLevel, sortBy]);

  const activeFilterCount = (filterCategory !== 'All' ? 1 : 0) + (filterLevel !== 'All' ? 1 : 0) + (sortBy !== 'newest' ? 1 : 0);

  const clearFilters = () => {
    setSearch('');
    setFilterCategory('All');
    setFilterLevel('All');
    setSortBy('newest');
  };

  const enrolledCourseIds = useMemo(
    () => new Set((user?.enrolledCourses || []).map((course) => course._id || course)),
    [user]
  );

  const completedCourseIds = useMemo(
    () => new Set((user?.completedCourses || []).map((c) => c.courseId)),
    [user]
  );

  const handleEnroll = async (courseId) => {
    setActionLoading(true);
    try {
      await api.post('/users/enroll', { courseId });
      await refreshProfile();
      toast.success('Course enrolled successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Enrollment failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setEditingCourse(null);
    setCourseForm(initialCourseForm);
  };

  const handleCourseSubmit = async (event) => {
    event.preventDefault();
    setActionLoading(true);

    try {
      if (editingCourse) {
        await api.put(`/courses/${editingCourse._id}`, courseForm);
        toast.success('Course updated successfully.');
      } else {
        await api.post('/courses', courseForm);
        toast.success('Course created successfully.');
      }

      await fetchCourses();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save course.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    setActionLoading(true);
    try {
      await api.delete(`/courses/${courseId}`);
      await fetchCourses();
      toast.success('Course deleted successfully.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      category: course.category || '',
      level: course.level || '',
      image: course.image || '',
      lessons: String(course.lessons || ''),
      seats: String(course.seats || ''),
      rating: String(course.rating || ''),
      playlistId: course.playlistId || '',
    });
  };

  const handleAssignCourse = async (event) => {
    event.preventDefault();
    setActionLoading(true);

    try {
      await api.post('/users/assign-course', assignment);
      await fetchStudents();
      toast.success('Course assigned successfully.');
      setAssignment({ userId: '', courseId: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to assign course.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Courses" description="Loading course catalog...">
        <div className="glass-panel rounded-[28px]">
          <Loader label="Fetching courses..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Courses"
      description={
        isAdmin
          ? 'Create, edit, delete, and assign courses from one streamlined workspace.'
          : 'Discover and enroll in the courses available in your portal.'
      }
    >
      {/* Certificate modal — triggered from course cards */}
      <CertificateModal
        isOpen={certModal.open}
        onClose={() => setCertModal({ open: false, course: null })}
        studentName={user?.name || 'Student'}
        courseTitle={certModal.course?.title || ''}
        completedAt={
          certModal.course
            ? (user?.completedCourses || []).find((c) => c.courseId === certModal.course._id)?.completedAt
            : null
        }
      />
      <div className="glass-panel rounded-[28px] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-brand-500">Course catalog</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              Browse and manage learning tracks
            </h3>
          </div>
          {/* Search bar */}
          <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-white/20 bg-white/60 px-4 py-3 dark:border-white/10 dark:bg-slate-900/60">
            <Search size={18} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, instructor, category…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="text-slate-400 hover:text-slate-600">
                <X size={16} />
              </button>
            )}
            <SlidersHorizontal size={18} className="text-brand-500" />
          </div>
        </div>

        {/* Filter row */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/20 pt-4 dark:border-white/10">
          {/* Category chips */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  filterCategory === cat
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-white/70 text-slate-600 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {/* Level filter */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="rounded-2xl border border-white/20 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l === 'All' ? 'All levels' : l}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-2xl border border-white/20 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none dark:border-white/10 dark:bg-slate-800 dark:text-slate-200"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Clear all */}
            {(activeFilterCount > 0 || search) && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-500/20 dark:text-rose-400"
              >
                <X size={12} /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Active filter summary pills */}
        {(filterCategory !== 'All' || filterLevel !== 'All' || sortBy !== 'newest') && (
          <div className="mt-3 flex flex-wrap gap-2">
            {filterCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-300">
                Category: {filterCategory}
                <button type="button" onClick={() => setFilterCategory('All')}><X size={11} /></button>
              </span>
            )}
            {filterLevel !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
                Level: {filterLevel}
                <button type="button" onClick={() => setFilterLevel('All')}><X size={11} /></button>
              </span>
            )}
            {sortBy !== 'newest' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                Sort: {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                <button type="button" onClick={() => setSortBy('newest')}><X size={11} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="glass-panel rounded-[28px] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-3 text-white dark:bg-white dark:text-slate-900">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Courses available</p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">{courses.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-panel rounded-[28px] p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500 p-3 text-white">
              <Users2 size={18} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isAdmin ? 'Students available' : 'Your enrollments'}
              </p>
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                {isAdmin ? students.length : enrolledCourseIds.size}
              </p>
            </div>
          </div>
        </div>
        <div className="glass-panel rounded-[28px] p-5">
          <p className="text-sm text-slate-500 dark:text-slate-400">Showing</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            {filteredCourses.length} <span className="text-lg font-normal text-slate-400">of {courses.length}</span>
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {activeFilterCount > 0 || search ? `${activeFilterCount + (search ? 1 : 0)} filter${activeFilterCount + (search ? 1 : 0) !== 1 ? 's' : ''} active` : 'No filters applied'}
          </p>
        </div>
      </div>

      {isAdmin ? (
        <div className="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="glass-panel rounded-[28px] p-6">
            <p className="text-sm text-brand-500">Admin tools</p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              {editingCourse ? 'Edit course' : 'Create a new course'}
            </h3>

            <form onSubmit={handleCourseSubmit} className="mt-5 space-y-4">
              {[
                ['title', 'Course title'],
                ['description', 'Description'],
                ['instructor', 'Instructor'],
                ['duration', 'Duration'],
                ['category', 'Category'],
                ['level', 'Level'],
                ['image', 'Image URL'],
                ['lessons', 'Lessons'],
                ['seats', 'Seats'],
                ['rating', 'Rating'],
                ['playlistId', 'YouTube Playlist ID (optional)'],
              ].map(([field, label]) => (
                <label key={field} className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
                    {label}
                  </span>
                  {field === 'description' ? (
                    <textarea
                      rows="4"
                      value={courseForm[field]}
                      onChange={(event) =>
                        setCourseForm((current) => ({ ...current, [field]: event.target.value }))
                      }
                      className="input-field resize-none"
                      required
                    />
                  ) : (
                    <input
                      type={['lessons', 'seats', 'rating'].includes(field) ? 'number' : 'text'}
                      value={courseForm[field]}
                      onChange={(event) =>
                        setCourseForm((current) => ({ ...current, [field]: event.target.value }))
                      }
                      className="input-field"
                      required={['title', 'instructor', 'duration', 'description'].includes(field)}
                      step={field === 'rating' ? '0.1' : undefined}
                      placeholder={field === 'playlistId' ? 'e.g. PLxxxxxxxxxxxxxxxxxxxxxxxx' : undefined}
                    />
                  )}
                  {field === 'playlistId' && (
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      Paste the playlist ID from a YouTube URL: youtube.com/playlist?list=<strong>THIS_PART</strong>
                    </p>
                  )}
                </label>
              ))}

              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={actionLoading} className="primary-btn">
                  {editingCourse ? 'Save changes' : 'Add course'}
                </button>
                <button type="button" onClick={resetForm} className="secondary-btn">
                  Clear
                </button>
              </div>
            </form>

            <div className="mt-8">
              <p className="text-sm text-brand-500">Assign course</p>
              <h4 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                Map a course to a student
              </h4>
              <form onSubmit={handleAssignCourse} className="mt-4 space-y-4">
                <select
                  value={assignment.userId}
                  onChange={(event) =>
                    setAssignment((current) => ({ ...current, userId: event.target.value }))
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>

                <select
                  value={assignment.courseId}
                  onChange={(event) =>
                    setAssignment((current) => ({ ...current, courseId: event.target.value }))
                  }
                  className="input-field"
                  required
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>

                <button type="submit" disabled={actionLoading} className="primary-btn w-full">
                  Assign to student
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {students.slice(0, 3).map((student) => (
                  <div
                    key={student._id}
                    className="flex items-center gap-3 rounded-3xl border border-white/20 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-900/50"
                  >
                    <img src={student.avatar} alt={student.name} className="h-12 w-12 rounded-2xl object-cover" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {student.enrolledCourses?.length || 0} assigned courses
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {filteredCourses.length ? (
              filteredCourses.map((course) => (
                <CourseCard
                  key={course._id}
                  course={course}
                  isAdmin
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  actionLoading={actionLoading}
                />
              ))
            ) : (
              <div className="glass-panel col-span-full rounded-[28px] p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                No courses match your search.
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.length ? (
            filteredCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={enrolledCourseIds.has(course._id)}
                isCompleted={completedCourseIds.has(course._id)}
                onEnroll={handleEnroll}
                onViewCertificate={(c) => setCertModal({ open: true, course: c })}
                actionLoading={actionLoading}
              />
            ))
          ) : (
            <div className="glass-panel col-span-full rounded-[28px] p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No courses found for that search.
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CoursesPage;
