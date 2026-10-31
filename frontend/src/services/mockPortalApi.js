const STORAGE_KEY = 'student-portal-demo-db';
const TOKEN_PREFIX = 'demo-token';
const DEFAULT_DELAY = 180;

const heroImages = {
  analytics:
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
  cybersecurity:
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
  design:
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  ai: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
  cloud:
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  management:
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
  softwareEng:
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  dataStructures:
    'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
  cpp:
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80',
  python:
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
  english:
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
};

const seedCourses = [
  {
    _id: 'course-ux-101',
    title: 'Product Design Studio',
    description:
      'Master user journeys, interface systems, and rapid prototyping for modern digital products.',
    instructor: 'Ariana Flores',
    duration: '8 weeks',
    category: 'Design',
    level: 'Intermediate',
    lessons: 28,
    seats: 48,
    rating: 4.9,
    image: heroImages.design,
    accent: 'from-rose-500 via-orange-400 to-amber-300',
    // Google UX Design Certificate – Coursera full playlist (Traversy Media / freeCodeCamp)
    playlistId: 'PLzWjrc7MgnznV9Ti61_Ygup0hJz5NkU-B',
    createdAt: '2026-03-22T08:00:00.000Z',
  },
  {
    _id: 'course-ai-205',
    title: 'Applied AI Foundations',
    description:
      'Build practical AI workflows, understand model evaluation, and launch responsible automation projects.',
    instructor: 'Dr. Ethan Park',
    duration: '10 weeks',
    category: 'Artificial Intelligence',
    level: 'Advanced',
    lessons: 36,
    seats: 42,
    rating: 4.8,
    image: heroImages.ai,
    accent: 'from-violet-500 via-indigo-500 to-sky-400',
    // freeCodeCamp Machine Learning with Python full course playlist
    playlistId: 'PLWKjhJtqVAblStefaz_YOVpDWqcRScc2s',
    createdAt: '2026-03-21T08:00:00.000Z',
  },
  {
    _id: 'course-cloud-120',
    title: 'Cloud Operations Lab',
    description:
      'Deploy resilient services, monitor workloads, and design secure cloud infrastructure at scale.',
    instructor: 'Mason Reid',
    duration: '6 weeks',
    category: 'Infrastructure',
    level: 'Beginner',
    lessons: 22,
    seats: 60,
    rating: 4.7,
    image: heroImages.cloud,
    accent: 'from-cyan-500 via-sky-500 to-blue-500',
    // AWS Cloud Practitioner full course – freeCodeCamp
    playlistId: 'PLBfufR7vyWmQ23gA2kZnLRSWC4FpyZgMK',
    createdAt: '2026-03-20T08:00:00.000Z',
  },
  {
    _id: 'course-data-330',
    title: 'Business Intelligence & Analytics',
    description:
      'Turn raw data into dashboards, forecasts, and decision-ready reports for executive teams.',
    instructor: 'Sophia Morgan',
    duration: '9 weeks',
    category: 'Analytics',
    level: 'Intermediate',
    lessons: 31,
    seats: 35,
    rating: 4.9,
    image: heroImages.analytics,
    accent: 'from-emerald-500 via-teal-400 to-cyan-300',
    // Power BI full course playlist – Learnit Training
    playlistId: 'PLoyECfvEFOjaMKFbBSKSmnOpEcXqqRegW',
    createdAt: '2026-03-19T08:00:00.000Z',
  },
  {
    _id: 'course-cyber-410',
    title: 'Cyber Defense Command',
    description:
      'Learn threat hunting, access control, and incident response for enterprise-grade security operations.',
    instructor: 'Nadia Khan',
    duration: '12 weeks',
    category: 'Security',
    level: 'Advanced',
    lessons: 40,
    seats: 24,
    rating: 5,
    image: heroImages.cybersecurity,
    accent: 'from-slate-900 via-slate-700 to-slate-500',
    // CompTIA Security+ full course – Professor Messer
    playlistId: 'PLG49S3nxzAnl4QDVqK-hOnoqcSKEIDDuv',
    createdAt: '2026-03-18T08:00:00.000Z',
  },
  {
    _id: 'course-mgmt-210',
    title: 'Academic Project Leadership',
    description:
      'Coordinate teams, timelines, and budgets while delivering polished capstone and department projects.',
    instructor: 'Olivia Bennett',
    duration: '5 weeks',
    category: 'Leadership',
    level: 'Beginner',
    lessons: 18,
    seats: 54,
    rating: 4.6,
    image: heroImages.management,
    accent: 'from-amber-500 via-yellow-400 to-lime-300',
    // Project Management full course – freeCodeCamp / Google PM Certificate
    playlistId: 'PLBfufR7vyWmQiAoCntNIZAIUMjWBWAFCX',
    createdAt: '2026-03-17T08:00:00.000Z',
  },
  {
    _id: 'course-se-510',
    title: 'Software Engineering Fundamentals',
    description:
      'Learn the full software development lifecycle — requirements, system design, architecture patterns, testing, and agile delivery practices used in real engineering teams.',
    instructor: 'Dr. James Carter',
    duration: '12 weeks',
    category: 'Software Engineering',
    level: 'Intermediate',
    lessons: 42,
    seats: 50,
    rating: 4.9,
    image: heroImages.softwareEng,
    accent: 'from-blue-600 via-indigo-500 to-violet-400',
    // Software Engineering full course – freeCodeCamp
    playlistId: 'PLBfufR7vyWmQR1hszWJpouFMFnQMFdJiO',
    createdAt: '2026-03-16T08:00:00.000Z',
  },
  {
    _id: 'course-ds-520',
    title: 'Data Structures & Algorithms',
    description:
      'Master arrays, linked lists, trees, graphs, sorting, and dynamic programming. Build the algorithmic thinking needed to crack technical interviews and write efficient code.',
    instructor: 'Prof. Anika Verma',
    duration: '10 weeks',
    category: 'Computer Science',
    level: 'Intermediate',
    lessons: 38,
    seats: 45,
    rating: 4.9,
    image: heroImages.dataStructures,
    accent: 'from-teal-500 via-cyan-500 to-blue-400',
    // Data Structures & Algorithms – freeCodeCamp full course
    playlistId: 'PLWKjhJtqVAblfum5WiQblKPwIbqYXkDoC',
    createdAt: '2026-03-15T08:00:00.000Z',
  },
  {
    _id: 'course-cpp-530',
    title: 'C++ Programming Masterclass',
    description:
      'From variables to templates, OOP, memory management, and the STL — a thorough C++ course that takes you from beginner to confident systems programmer.',
    instructor: 'Marcus Lin',
    duration: '8 weeks',
    category: 'Programming',
    level: 'Beginner',
    lessons: 32,
    seats: 55,
    rating: 4.8,
    image: heroImages.cpp,
    accent: 'from-slate-700 via-blue-700 to-blue-500',
    // C++ Full Course for Beginners – freeCodeCamp
    playlistId: 'PLlrxD0HtieHjZe36GvnmRFkduX7CEakYI',
    createdAt: '2026-03-14T08:00:00.000Z',
  },
  {
    _id: 'course-py-540',
    title: 'Python for Everyone',
    description:
      'A practical Python course covering syntax, data types, functions, OOP, file handling, and projects — everything you need to start building real-world applications.',
    instructor: 'Sara Nguyen',
    duration: '7 weeks',
    category: 'Programming',
    level: 'Beginner',
    lessons: 30,
    seats: 70,
    rating: 4.9,
    image: heroImages.python,
    accent: 'from-yellow-400 via-green-400 to-teal-400',
    // Python Full Course for Beginners – freeCodeCamp
    playlistId: 'PLWKjhJtqVAbnqBxcdjVGgT3uVR10bzTEB',
    createdAt: '2026-03-13T08:00:00.000Z',
  },
  {
    _id: 'course-eng-550',
    title: 'English Communication Skills',
    description:
      'Build confident spoken and written English for academic, professional, and everyday contexts — grammar, vocabulary, email writing, presentations, and conversation practice.',
    instructor: 'Emily Rhodes',
    duration: '6 weeks',
    category: 'Language',
    level: 'Beginner',
    lessons: 24,
    seats: 80,
    rating: 4.7,
    image: heroImages.english,
    accent: 'from-pink-500 via-rose-400 to-orange-300',
    // English Speaking Full Course – Shaw English Online
    playlistId: 'PLmwr9polMHwsI6vWZkm3W_VE7cWtYVjix',
    createdAt: '2026-03-12T08:00:00.000Z',
  },
];

const seedUsers = [
  {
    _id: 'user-admin-demo',
    name: 'Dr. Maya Bennett',
    email: 'admin@demoportal.com',
    password: 'Admin@123',
    role: 'admin',
    enrolledCourses: ['course-data-330', 'course-mgmt-210'],
    createdAt: '2026-03-18T08:00:00.000Z',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    department: 'Academic Operations',
    title: 'Director of Digital Learning',
    phone: '+91 98765 43210',
    location: 'Innovation Tower, Level 6',
    bio: 'Leads student experience, faculty enablement, and campus-wide digital transformation.',
    isSeededDemo: true,
  },
  {
    _id: 'user-student-demo',
    name: 'Aarav Sharma',
    email: 'student@demoportal.com',
    password: 'Student@123',
    role: 'student',
    enrolledCourses: ['course-ux-101', 'course-ai-205', 'course-data-330'],
    createdAt: '2026-03-21T09:30:00.000Z',
    avatar:
      'https://media.istockphoto.com/id/2105091005/photo/young-student-taking-notes-while-e-learning-on-laptop-at-the-university.jpg?s=612x612&w=0&k=20&c=5AoTWNFmHm-HeQfx0FzB3LPm3MKQXgokYelEvmC_47E=',
    department: 'Computer Science',
    title: 'Final Year Student',
    phone: '+91 99887 66554',
    location: 'Residence Hall A',
    bio: 'Focused on AI products, analytics, and design-led problem solving across campus projects.',
    attendance: 92,
    learningHours: 23,
    completionRate: 88,
    isSeededDemo: true,
  },
  {
    _id: 'user-student-demo-2',
    name: 'Riya Patel',
    email: 'riya.patel@demoportal.com',
    password: 'Student@123',
    role: 'student',
    enrolledCourses: ['course-cloud-120', 'course-cyber-410'],
    createdAt: '2026-03-20T10:15:00.000Z',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80',
    department: 'Information Technology',
    title: 'Third Year Student',
    phone: '+91 98111 22334',
    location: 'Tech Block',
    bio: 'Interested in infrastructure reliability, security operations, and applied cloud engineering.',
    attendance: 88,
    learningHours: 20,
    completionRate: 76,
    isSeededDemo: true,
  },
  {
    _id: 'user-student-demo-3',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@demoportal.com',
    password: 'Student@123',
    role: 'student',
    enrolledCourses: ['course-mgmt-210', 'course-data-330', 'course-ux-101'],
    createdAt: '2026-03-19T12:45:00.000Z',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    department: 'Business Administration',
    title: 'Campus Venture Fellow',
    phone: '+91 99000 11223',
    location: 'Enterprise Lab',
    bio: 'Brings business strategy, analytics, and student venture operations together.',
    attendance: 85,
    learningHours: 26,
    completionRate: 82,
    isSeededDemo: true,
  },
];

const demoAccounts = {
  student: {
    email: 'student@demoportal.com',
    password: 'Student@123',
  },
  admin: {
    email: 'admin@demoportal.com',
    password: 'Admin@123',
  },
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const createError = (status, message) => {
  const error = new Error(message);
  error.response = { status, data: { message } };
  return error;
};

const delay = (value, ms = DEFAULT_DELAY) =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(value), ms);
  });

const readDb = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
};

const writeDb = (db) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  return db;
};

const createStudentProfile = (user) => ({
  // Identity: use what the user actually provided; never fabricate a fallback
  department: user.department || '',
  title: user.title || '',
  phone: user.phone || '',
  location: user.location || '',
  bio: user.bio || '',
  // Stats: seeded demo users keep their stored real values; fresh users start at 0
  learningHours: user.isSeededDemo ? (user.learningHours ?? 0) : 0,
  attendance: user.isSeededDemo ? (user.attendance ?? 0) : 0,
  completionRate: user.isSeededDemo ? (user.completionRate ?? 0) : 0,
  // Completed courses — always real stored data
  completedCourses: Array.isArray(user.completedCourses) ? user.completedCourses : [],
});

const createAdminProfile = (user, courseCount = 0, studentCount = 0) => ({
  // Identity: use what the user actually provided; never fabricate a fallback
  department: user.department || '',
  title: user.title || '',
  phone: user.phone || '',
  location: user.location || '',
  bio: user.bio || '',
  // Aggregate portal stats (real data, not per-admin fabrication)
  managedPrograms: courseCount,
  activeStudents: studentCount,
  // Satisfaction only meaningful for seeded demo admin
  satisfaction: user.isSeededDemo ? 96 : 0,
});

const ensureDb = () => {
  const existingDb = readDb();

  if (existingDb) {
    let dirty = false;

    // Migration: ensure announcements array exists
    if (!Array.isArray(existingDb.announcements)) {
      existingDb.announcements = [];
      dirty = true;
    }

    // Migration: sync playlistId onto existing seeded courses that predate this field
    // and add any newly seeded courses that don't exist yet in the stored DB
    seedCourses.forEach((seed) => {
      const existing = existingDb.courses.find((c) => c._id === seed._id);
      if (!existing) {
        existingDb.courses.push({ ...seed });
        dirty = true;
      } else if (existing.playlistId === undefined && seed.playlistId) {
        existing.playlistId = seed.playlistId;
        dirty = true;
      }
    });

    // Migration: ensure every user has a completedCourses array
    existingDb.users.forEach((user) => {
      if (!Array.isArray(user.completedCourses)) {
        user.completedCourses = [];
        dirty = true;
      }
    });

    // Migration: fix any non-seeded users that were created under the old register()
    // which stamped them with pre-enrolled courses and fake identity. Strip those out.
    existingDb.users.forEach((user) => {
      if (!user.isSeededDemo) {
        // Remove pre-seeded courses that were injected by the old register()
        const fakePreSeeded = ['course-cloud-120', 'course-mgmt-210'];
        const before = user.enrolledCourses.length;
        user.enrolledCourses = user.enrolledCourses.filter((id) => !fakePreSeeded.includes(id));
        if (user.enrolledCourses.length !== before) dirty = true;

        // Remove fabricated identity fields (avatar will now be regenerated from DiceBear)
        for (const field of ['title', 'phone', 'location', 'bio']) {
          if (user[field] !== undefined) {
            delete user[field];
            dirty = true;
          }
        }

        // Assign DiceBear avatar if still missing
        if (!user.avatar) {
          user.avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=6366f1,8b5cf6,0ea5e9,10b981,f59e0b&backgroundType=gradientLinear&fontSize=38`;
          dirty = true;
        }

        // Remove fake default department only if it matches the old fabricated values
        const fakeDepts = ['Emerging Technology', 'Academic Operations'];
        if (fakeDepts.includes(user.department) && !user._departmentSetByUser) {
          delete user.department;
          dirty = true;
        }

        // Zero out non-zero stats that were set by the old baseline formula
        if (user.attendance !== undefined || user.learningHours !== undefined || user.completionRate !== undefined) {
          user.attendance = user.attendance ?? 0;
          user.learningHours = user.learningHours ?? 0;
          user.completionRate = user.completionRate ?? 0;
        }
      }
    });

    if (dirty) writeDb(existingDb);
    return existingDb;
  }

  return writeDb({
    users: seedUsers,
    courses: seedCourses,
    announcements: [],
  });
};

const populateCourse = (course) => clone(course);

const populateUser = (user, db) => {
  const courseList = user.enrolledCourses
    .map((courseId) => db.courses.find((course) => course._id === courseId))
    .filter(Boolean)
    .map(populateCourse);

  const baseProfile =
    user.role === 'admin'
      ? createAdminProfile(
          user,
          db.courses.length,
          db.users.filter((entry) => entry.role === 'student').length
        )
      : createStudentProfile(user, courseList.length);

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    avatar: user.avatar,
    enrolledCourses: courseList,
    ...baseProfile,
  };
};

const generateToken = (userId) => `${TOKEN_PREFIX}-${userId}`;

const getUserIdFromToken = (token) => {
  if (!token?.startsWith(`${TOKEN_PREFIX}-`)) {
    return null;
  }

  return token.replace(`${TOKEN_PREFIX}-`, '');
};

const getCurrentUser = (token, db) => {
  const userId = getUserIdFromToken(token);
  if (!userId) {
    throw createError(401, 'Invalid or expired session.');
  }

  const user = db.users.find((entry) => entry._id === userId);
  if (!user) {
    throw createError(404, 'User not found.');
  }

  return user;
};

const sortByDateDesc = (items) =>
  [...items].sort(
    (left, right) =>
      new Date(right.createdAt || '1970-01-01T00:00:00.000Z') -
      new Date(left.createdAt || '1970-01-01T00:00:00.000Z')
  );

const withAuth = (handler) => async (token, payload) => {
  const db = ensureDb();
  const user = getCurrentUser(token, db);
  return handler({ db, user, payload });
};

const demoApi = {
  isDemoToken: (token) => token?.startsWith(`${TOKEN_PREFIX}-`) || false,
  isEnabled: () => import.meta.env.VITE_USE_DEMO_MODE !== 'false',
  getDemoAccounts: () => clone(demoAccounts),
  resetDemoData: () => writeDb({ users: seedUsers, courses: seedCourses, announcements: [] }),
  login: async ({ email, password }) => {
    const db = ensureDb();

    if (!email || !password) {
      throw createError(400, 'Email and password are required.');
    }

    const user = db.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());

    if (!user || user.password !== password) {
      throw createError(401, 'Invalid email or password.');
    }

    return delay({
      data: {
        message: 'Login successful.',
        token: generateToken(user._id),
        user: populateUser(user, db),
      },
    });
  },
  register: async ({ name, email, password, role, department }) => {
    const db = ensureDb();

    if (!name || !email || !password) {
      throw createError(400, 'Name, email, and password are required.');
    }

    const existingUser = db.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw createError(400, 'Email is already registered.');
    }

    // Fresh user: no pre-enrolled courses, no fabricated stats or identity
    const user = {
      _id: `user-${crypto.randomUUID()}`,
      name,
      email,
      password,
      role: role === 'admin' ? 'admin' : 'student',
      enrolledCourses: [],
      completedCourses: [],
      department: department?.trim() || '',
      // Generate a deterministic avatar from the user's name via DiceBear
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6366f1,8b5cf6,0ea5e9,10b981,f59e0b&backgroundType=gradientLinear&fontSize=38`,
      createdAt: new Date().toISOString(),
      // isSeededDemo intentionally absent — fresh users always start empty
    };

    db.users.push(user);
    writeDb(db);

    return delay({
      data: {
        message: 'Registration successful.',
        token: generateToken(user._id),
        user: populateUser(user, db),
      },
    });
  },
  getProfile: withAuth(async ({ db, user }) => delay({ data: populateUser(user, db) })),
  updateProfile: withAuth(async ({ db, user, payload }) => {
    const nextEmail = payload.email?.trim();

    if (nextEmail) {
      const existingUser = db.users.find(
        (entry) => entry.email.toLowerCase() === nextEmail.toLowerCase() && entry._id !== user._id
      );

      if (existingUser) {
        throw createError(400, 'Email is already registered.');
      }
    }

    user.name = payload.name?.trim() || user.name;
    user.email = nextEmail || user.email;
    user.password = payload.password?.trim() || user.password;

    // Extended profile fields — persist whatever was sent
    if (payload.phone !== undefined) user.phone = payload.phone.trim();
    if (payload.location !== undefined) user.location = payload.location.trim();
    if (payload.bio !== undefined) user.bio = payload.bio.trim();
    if (payload.department !== undefined) user.department = payload.department.trim();

    writeDb(db);

    return delay({
      data: {
        message: 'Profile updated successfully.',
        user: populateUser(user, db),
      },
    });
  }),
  getCourseById: async (id) => {
    const db = ensureDb();
    const course = db.courses.find((c) => c._id === id);
    if (!course) throw createError(404, 'Course not found.');
    return delay({ data: populateCourse(course) });
  },
  getCourses: async () => {
    const db = ensureDb();
    const courses = sortByDateDesc(
      db.courses.map((course) => ({
        ...course,
        enrolledCount: db.users.filter((user) => user.enrolledCourses.includes(course._id)).length,
      }))
    );

    return delay({ data: courses.map(populateCourse) });
  },
  createCourse: withAuth(async ({ db, user, payload }) => {
    if (user.role !== 'admin') {
      throw createError(403, 'Admin access required.');
    }

    const requiredFields = ['title', 'description', 'instructor', 'duration'];
    const missingField = requiredFields.find((field) => !payload[field]?.trim());

    if (missingField) {
      throw createError(400, 'All course fields are required.');
    }

    const course = {
      _id: `course-${crypto.randomUUID()}`,
      title: payload.title.trim(),
      description: payload.description.trim(),
      instructor: payload.instructor.trim(),
      duration: payload.duration.trim(),
      category: payload.category?.trim() || 'Special Program',
      level: payload.level?.trim() || 'Intermediate',
      lessons: Number(payload.lessons) || 24,
      seats: Number(payload.seats) || 40,
      rating: Number(payload.rating) || 4.8,
      image: payload.image?.trim() || heroImages.analytics,
      accent: payload.accent?.trim() || 'from-brand-500 via-sky-500 to-cyan-300',
      playlistId: payload.playlistId?.trim() || '',
      createdAt: new Date().toISOString(),
    };

    db.courses.unshift(course);
    writeDb(db);

    return delay({
      data: {
        message: 'Course created successfully.',
        course: populateCourse(course),
      },
    });
  }),
  updateCourse: withAuth(async ({ db, user, payload }) => {
    if (user.role !== 'admin') {
      throw createError(403, 'Admin access required.');
    }

    const course = db.courses.find((entry) => entry._id === payload.id);
    if (!course) {
      throw createError(404, 'Course not found.');
    }

    ['title', 'description', 'instructor', 'duration', 'category', 'level', 'image', 'accent', 'playlistId'].forEach(
      (field) => {
        if (payload[field]?.trim()) {
          course[field] = payload[field].trim();
        }
      }
    );

    ['lessons', 'seats', 'rating'].forEach((field) => {
      if (payload[field] !== undefined && payload[field] !== '') {
        course[field] = Number(payload[field]);
      }
    });

    writeDb(db);

    return delay({
      data: {
        message: 'Course updated successfully.',
        course: populateCourse(course),
      },
    });
  }),
  deleteCourse: withAuth(async ({ db, user, payload }) => {
    if (user.role !== 'admin') {
      throw createError(403, 'Admin access required.');
    }

    const courseIndex = db.courses.findIndex((entry) => entry._id === payload.id);
    if (courseIndex === -1) {
      throw createError(404, 'Course not found.');
    }

    db.courses.splice(courseIndex, 1);
    db.users.forEach((entry) => {
      entry.enrolledCourses = entry.enrolledCourses.filter((courseId) => courseId !== payload.id);
    });
    writeDb(db);

    return delay({ data: { message: 'Course deleted successfully.' } });
  }),
  enrollCourse: withAuth(async ({ db, user, payload }) => {
    if (user.role !== 'student') {
      throw createError(403, 'Only students can enroll in courses.');
    }

    if (!payload.courseId) {
      throw createError(400, 'Course ID is required.');
    }

    const course = db.courses.find((entry) => entry._id === payload.courseId);
    if (!course) {
      throw createError(404, 'Course not found.');
    }

    if (user.enrolledCourses.includes(payload.courseId)) {
      throw createError(400, 'You are already enrolled in this course.');
    }

    user.enrolledCourses.push(payload.courseId);
    writeDb(db);

    return delay({
      data: {
        message: 'Course enrolled successfully.',
        user: populateUser(user, db),
      },
    });
  }),
  getStudents: withAuth(async ({ db, user }) => {
    if (user.role !== 'admin') {
      throw createError(403, 'Admin access required.');
    }

    const students = sortByDateDesc(db.users.filter((entry) => entry.role === 'student')).map((entry) =>
      populateUser(entry, db)
    );

    return delay({ data: students });
  }),
  assignCourseToStudent: withAuth(async ({ db, user, payload }) => {
    if (user.role !== 'admin') {
      throw createError(403, 'Admin access required.');
    }

    const student = db.users.find((entry) => entry._id === payload.userId && entry.role === 'student');
    if (!student) {
      throw createError(404, 'Student not found.');
    }

    const course = db.courses.find((entry) => entry._id === payload.courseId);
    if (!course) {
      throw createError(404, 'Course not found.');
    }

    if (student.enrolledCourses.includes(payload.courseId)) {
      throw createError(400, 'Course already assigned to this student.');
    }

    student.enrolledCourses.push(payload.courseId);
    writeDb(db);

    return delay({
      data: {
        message: 'Course assigned successfully.',
        student: populateUser(student, db),
      },
    });
  }),
  // Admin-only: update a student's attendance, learningHours, completionRate
  updateStudentStats: withAuth(async ({ db, user, payload }) => {
    if (user.role !== 'admin') {
      throw createError(403, 'Admin access required.');
    }

    const student = db.users.find(
      (entry) => entry._id === payload.userId && entry.role === 'student'
    );
    if (!student) {
      throw createError(404, 'Student not found.');
    }

    if (payload.attendance !== undefined) {
      const val = Number(payload.attendance);
      if (Number.isNaN(val) || val < 0 || val > 100) {
        throw createError(400, 'Attendance must be a number between 0 and 100.');
      }
      student.attendance = val;
    }

    if (payload.learningHours !== undefined) {
      const val = Number(payload.learningHours);
      if (Number.isNaN(val) || val < 0) {
        throw createError(400, 'Learning hours must be a non-negative number.');
      }
      student.learningHours = val;
    }

    if (payload.completionRate !== undefined) {
      const val = Number(payload.completionRate);
      if (Number.isNaN(val) || val < 0 || val > 100) {
        throw createError(400, 'Completion rate must be a number between 0 and 100.');
      }
      student.completionRate = val;
    }

    writeDb(db);

    return delay({
      data: {
        message: 'Student stats updated successfully.',
        student: populateUser(student, db),
      },
    });
  }),
  // Student: mark an enrolled course as complete and get a completion record
  markCourseComplete: withAuth(async ({ db, user, payload }) => {
    if (user.role !== 'student') {
      throw createError(403, 'Only students can mark courses as complete.');
    }

    const { courseId } = payload;
    if (!courseId) throw createError(400, 'Course ID is required.');

    const course = db.courses.find((c) => c._id === courseId);
    if (!course) throw createError(404, 'Course not found.');

    if (!user.enrolledCourses.includes(courseId)) {
      throw createError(400, 'You must be enrolled in this course to mark it complete.');
    }

    if (!Array.isArray(user.completedCourses)) user.completedCourses = [];

    // Idempotent — only add if not already completed
    const existing = user.completedCourses.find((c) => c.courseId === courseId);
    if (!existing) {
      user.completedCourses.push({
        courseId,
        completedAt: new Date().toISOString(),
      });
      writeDb(db);
    }

    const completedAt = (existing || user.completedCourses.find((c) => c.courseId === courseId)).completedAt;

    return delay({
      data: {
        message: 'Course marked as complete.',
        user: populateUser(user, db),
        completedAt,
      },
    });
  }),
  // ── Announcements ───────────────────────────────────────────────────────
  getAnnouncements: async () => {
    const db = ensureDb();
    return delay({ data: [...(db.announcements || [])].reverse() });
  },
  postAnnouncement: withAuth(async ({ db, user, payload }) => {
    if (user.role !== 'admin') {
      throw createError(403, 'Admin access required.');
    }
    const { title, body, type = 'info' } = payload;
    if (!title?.trim() || !body?.trim()) {
      throw createError(400, 'Title and body are required.');
    }
    const announcement = {
      _id: `ann-${crypto.randomUUID()}`,
      title: title.trim(),
      body: body.trim(),
      type, // 'info' | 'warning' | 'success'
      author: user.name,
      createdAt: new Date().toISOString(),
    };
    if (!Array.isArray(db.announcements)) db.announcements = [];
    db.announcements.push(announcement);
    writeDb(db);
    return delay({ data: { message: 'Announcement posted.', announcement } });
  }),
  deleteAnnouncement: withAuth(async ({ db, user, payload }) => {
    if (user.role !== 'admin') {
      throw createError(403, 'Admin access required.');
    }
    db.announcements = (db.announcements || []).filter((a) => a._id !== payload.id);
    writeDb(db);
    return delay({ data: { message: 'Announcement deleted.' } });
  }),
  // ── Analytics ───────────────────────────────────────────────────────────
  getAdminAnalytics: withAuth(async ({ db, user }) => {
    if (user.role !== 'admin') {
      throw createError(403, 'Admin access required.');
    }

    const students = db.users.filter((entry) => entry.role === 'student');
    const recentStudents = sortByDateDesc(students)
      .slice(0, 5)
      .map((entry) => populateUser(entry, db));
    const totalEnrollments = students.reduce((sum, entry) => sum + entry.enrolledCourses.length, 0);

    return delay({
      data: {
        totalStudents: students.length,
        totalCourses: db.courses.length,
        totalEnrollments,
        recentStudents,
        featuredCourses: db.courses.slice(0, 4).map((course) => ({
          ...populateCourse(course),
          enrolledCount: students.filter((entry) => entry.enrolledCourses.includes(course._id)).length,
        })),
      },
    });
  }),
};

export default demoApi;
