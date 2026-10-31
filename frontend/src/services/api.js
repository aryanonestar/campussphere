import axios from 'axios';
import demoApi from './mockPortalApi';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('student-portal-token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const useDemoMode = () => demoApi.isEnabled();

const getToken = () => localStorage.getItem('student-portal-token');

const api = {
  get: (url, config) => {
    if (useDemoMode()) {
      const token = getToken();

      if (url === '/users/profile') return demoApi.getProfile(token);
      if (url === '/courses') return demoApi.getCourses();
      if (url.startsWith('/courses/')) return demoApi.getCourseById(url.replace('/courses/', ''));
      if (url === '/users/students') return demoApi.getStudents(token);
      if (url === '/users/analytics') return demoApi.getAdminAnalytics(token);
      if (url === '/announcements') return demoApi.getAnnouncements();
    }

    return http.get(url, config);
  },
  post: (url, payload, config) => {
    if (useDemoMode()) {
      const token = getToken();

      if (url === '/auth/login') return demoApi.login(payload);
      if (url === '/auth/register') return demoApi.register(payload);
      if (url === '/users/enroll') return demoApi.enrollCourse(token, payload);
      if (url === '/users/assign-course') return demoApi.assignCourseToStudent(token, payload);
      if (url === '/users/mark-complete') return demoApi.markCourseComplete(token, payload);
      if (url === '/courses') return demoApi.createCourse(token, payload);
      if (url === '/announcements') return demoApi.postAnnouncement(token, payload);
    }

    return http.post(url, payload, config);
  },
  put: (url, payload, config) => {
    if (useDemoMode()) {
      const token = getToken();

      if (url === '/users/update') return demoApi.updateProfile(token, payload);
      if (url === '/users/update-student-stats') return demoApi.updateStudentStats(token, payload);
      if (url.startsWith('/courses/')) {
        return demoApi.updateCourse(token, { ...payload, id: url.replace('/courses/', '') });
      }
    }

    return http.put(url, payload, config);
  },
  delete: (url, config) => {
    if (useDemoMode()) {
      const token = getToken();

      if (url.startsWith('/announcements/')) {
        return demoApi.deleteAnnouncement(token, { id: url.replace('/announcements/', '') });
      }
      if (url.startsWith('/courses/')) {
        return demoApi.deleteCourse(token, { id: url.replace('/courses/', '') });
      }
    }

    return http.delete(url, config);
  },
};

export default api;
