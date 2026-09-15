import { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { CoursePage } from './components/CoursePage';
import { LoginPage, ProfilePage } from './components/AccountPages';
import type { CourseContent } from './content/types';

export function App() {
  if (window.location.pathname === '/login.html') return <LoginPage />;
  if (window.location.pathname === '/profile.html') return <ProfilePage />;
  return <LearningPages />;
}

function LearningPages() {
  const [courses, setCourses] = useState<CourseContent[] | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setError(false);
    fetch('/api/curriculum', { signal: controller.signal }).then(response => {
      if (!response.ok) throw new Error('Course content unavailable');
      return response.json();
    }).then(data => setCourses(data.courses)).catch(reason => {
      if (reason.name !== 'AbortError') setError(true);
    });
    return () => controller.abort();
  }, [attempt]);
  if (error) return <main className="wrap page-state"><h1 className="h1">We couldn’t load the courses.</h1><p>Please try again in a moment.</p><button className="btn" onClick={() => setAttempt(attempt + 1)}>Try again</button></main>;
  if (!courses) return <main className="wrap page-state" role="status">Loading courses…</main>;
  return window.location.pathname === '/course.html' ? <CoursePage courses={courses} /> : <Dashboard courses={courses} />;
}
