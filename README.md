# CampusSphere

CampusSphere is a full-stack student portal project built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB. It provides separate student and admin experiences for authentication, course management, enrollment, profile updates, and dashboard analytics.

The frontend also includes a built-in demo mode powered by a local mock API, so the project can run even without a live backend or MongoDB connection.

## Highlights

- Role-based authentication for `student` and `admin`
- Student dashboard with enrolled course insights and profile stats
- Admin dashboard with student analytics and course activity summaries
- Course catalog with search and enrollment
- Admin tools to create, edit, delete, and assign courses
- Profile management for logged-in users
- Demo mode with seeded users and courses stored in `localStorage`
- Real backend API with JWT auth and MongoDB persistence
- Responsive UI with Tailwind CSS, Framer Motion, and React Hot Toast

## Tech Stack

### Frontend

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Framer Motion
- Lucide React
- React Hot Toast

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Morgan
- CORS

## Project Structure

```text
Student Portal/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   `-- services/
|   |-- index.html
|   `-- vite.config.js
|-- package.json
|-- package-lock.json
`-- README.md
```

## Core Features

### Authentication

- User registration
- User login
- JWT-based protected backend routes
- Role-based route access in the frontend
- Session persistence using `localStorage`

### Student Experience

- View student dashboard
- Review enrolled courses
- Track learning hours, attendance, and completion rate in demo mode
- Search available courses
- Enroll in courses
- Update profile details

### Admin Experience

- View analytics dashboard
- See total students, total courses, and total enrollments
- Review recently registered students
- Create new courses
- Edit existing courses
- Delete courses
- Assign courses to students

### Demo Mode

- Runs from the frontend without requiring the backend
- Stores seeded data in browser `localStorage`
- Includes ready-made student and admin demo accounts
- Supports login, registration, course CRUD, enrollment, analytics, and profile updates

## Demo Accounts

When demo mode is enabled, you can sign in with:

### Student

- Email: `student@demoportal.com`
- Password: `Student@123`

### Admin

- Email: `admin@demoportal.com`
- Password: `Admin@123`

## How Demo Mode Works

The frontend API layer in [frontend/src/services/api.js](/c:/Users/yarra/Desktop/Student%20Portal/frontend/src/services/api.js) checks whether demo mode is enabled. If it is, requests are routed to [frontend/src/services/mockPortalApi.js](/c:/Users/yarra/Desktop/Student%20Portal/frontend/src/services/mockPortalApi.js) instead of the real backend.

Demo mode is enabled by default unless `VITE_USE_DEMO_MODE=false` is set in the frontend environment.

## Installation

### 1. Clone and enter the project

```bash
git clone https://github.com/Harishreddyyarramada/Student-Portal---CampusSphere.git
cd Student-Portal---CampusSphere
```

### 2. Install dependencies

From the project root:

```bash
npm run install:all
```

This installs:

- Root development dependencies
- Backend dependencies
- Frontend dependencies

## Running the Project

### Option 1: Run in Demo Mode

This is the fastest way to start the project.

1. Create `frontend/.env` if needed.
2. Make sure demo mode is not disabled.
3. Start the frontend.

Example `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Then run:

```bash
npm run dev --prefix frontend
```

The app will be available at `http://localhost:5173`.

### Option 2: Run Full Stack with Backend

#### Backend environment

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

#### Frontend environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_DEMO_MODE=false
```

#### Start both servers

From the project root:

```bash
npm run dev
```

This starts:

- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`

## Available Scripts

### Root

- `npm run install:all` - installs dependencies for root, frontend, and backend
- `npm run dev` - runs backend and frontend together using `concurrently`

### Frontend

Run from `frontend/` or use `--prefix frontend`.

- `npm run dev` - starts the Vite development server
- `npm run build` - creates a production build
- `npm run preview` - previews the production build locally

### Backend

Run from `backend/` or use `--prefix backend`.

- `npm run dev` - starts the backend with Nodemon
- `npm run start` - starts the backend with Node

## Render Deployment Notes

If you deploy the backend to Render from the `backend/` directory, use one of these start commands:

- `npm start`
- `node server.js`

Linux file systems are case-sensitive, so `node Server.js` can fail even though it may appear to work on Windows.

## Environment Variables

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | Base URL for backend API. Defaults to `http://localhost:5000/api` |
| `VITE_USE_DEMO_MODE` | No | Set to `false` to force the frontend to use the real backend |

### Backend

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Backend server port. Defaults to `5000` |
| `MONGO_URI` | Yes for backend mode | MongoDB connection string |
| `JWT_SECRET` | Yes for backend mode | Secret used to sign JWT tokens |
| `CLIENT_URL` | No | Allowed frontend origin for CORS |

## API Overview

Base URL: `http://localhost:5000/api`

### Auth Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login user |

### User Routes

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/users/profile` | Student, Admin | Get current user profile |
| `PUT` | `/users/update` | Student, Admin | Update current user profile |
| `POST` | `/users/enroll` | Student | Enroll in a course |
| `GET` | `/users/students` | Admin | List all students |
| `POST` | `/users/assign-course` | Admin | Assign a course to a student |
| `GET` | `/users/analytics` | Admin | Fetch admin dashboard analytics |

### Course Routes

| Method | Route | Access | Description |
|---|---|---|---|
| `GET` | `/courses` | Authenticated | Get all courses |
| `POST` | `/courses` | Admin | Create a course |
| `PUT` | `/courses/:id` | Admin | Update a course |
| `DELETE` | `/courses/:id` | Admin | Delete a course |

## Data Models

### User

Backend user model fields from [backend/models/User.js](/c:/Users/yarra/Desktop/Student%20Portal/backend/models/User.js):

- `name`
- `email`
- `password`
- `role`
- `enrolledCourses`
- `createdAt`
- `updatedAt`

### Course

Backend course model fields from [backend/models/Course.js](/c:/Users/yarra/Desktop/Student%20Portal/backend/models/Course.js):

- `title`
- `description`
- `instructor`
- `duration`
- `createdAt`
- `updatedAt`

Note: the demo API includes richer course and profile fields such as `category`, `level`, `image`, `rating`, `attendance`, and analytics-friendly metadata that do not currently exist in the MongoDB schema.

## Frontend Routing

Frontend routes are defined in [frontend/src/App.jsx](/c:/Users/yarra/Desktop/Student%20Portal/frontend/src/App.jsx):

| Route | Access |
|---|---|
| `/login` | Public |
| `/register` | Public |
| `/dashboard` | Student only |
| `/admin` | Admin only |
| `/courses` | Student and Admin |
| `/profile` | Student and Admin |

## Authentication Flow

1. User registers or logs in.
2. The frontend stores the JWT or demo token in `localStorage`.
3. Protected routes are guarded by the frontend.
4. Axios automatically sends the `Authorization` header for backend requests.
5. The backend validates the token and role before protected actions.

## UI Notes

- The project supports light and dark theme toggling
- Notifications are shown with React Hot Toast
- Motion and transitions are handled with Framer Motion
- Styling is built with Tailwind utility classes and custom component patterns

## Current Limitations

- There are no automated tests configured yet
- The backend `Course` schema is simpler than the demo course structure
- Demo mode and backend mode do not return exactly the same data shape for every field
- No Docker setup is included
- No deployment configuration is included

## Suggested Improvements

- Add unit and integration tests
- Expand the backend course schema to match the richer frontend demo data
- Add pagination and filtering to course and student lists
- Add password reset and email verification flows
- Add file upload support for profile avatars
- Add deployment instructions for Vercel, Netlify, Render, or Railway

## Important Files

- [package.json](/c:/Users/yarra/Desktop/Student%20Portal/package.json)
- [backend/server.js](/c:/Users/yarra/Desktop/Student%20Portal/backend/server.js)
- [backend/routes/authRoutes.js](/c:/Users/yarra/Desktop/Student%20Portal/backend/routes/authRoutes.js)
- [backend/routes/userRoutes.js](/c:/Users/yarra/Desktop/Student%20Portal/backend/routes/userRoutes.js)
- [backend/routes/courseRoutes.js](/c:/Users/yarra/Desktop/Student%20Portal/backend/routes/courseRoutes.js)
- [frontend/src/App.jsx](/c:/Users/yarra/Desktop/Student%20Portal/frontend/src/App.jsx)
- [frontend/src/context/AuthContext.jsx](/c:/Users/yarra/Desktop/Student%20Portal/frontend/src/context/AuthContext.jsx)
- [frontend/src/services/api.js](/c:/Users/yarra/Desktop/Student%20Portal/frontend/src/services/api.js)
- [frontend/src/services/mockPortalApi.js](/c:/Users/yarra/Desktop/Student%20Portal/frontend/src/services/mockPortalApi.js)

## License

This project currently has no explicit license file. Add a `LICENSE` file if you want to define usage permissions for others.
