import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { fetchMe, type AuthUser } from '../auth';
import type { CourseContent } from '../content/types';
import painted_panorama from '../../assets/painted-panorama.jpg';
import painted_git from '../../assets/painted-git.jpg';
import painted_github from '../../assets/painted-github.jpg';
import painted_monitor from '../../assets/painted-monitor.jpg';

export function Navigation({ page = 'dashboard' }: { page?: 'dashboard' | 'courses' }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  useEffect(() => { fetchMe().then(setUser).catch(() => setUser(null)); }, []);
  return <header className="nav"><div className="nav-inner">
    <a className="wordmark" href="/"><span className="door" aria-hidden="true" />Code Practice</a>
    <nav className="nav-links" aria-label="Course navigation">
      <a href="/" className={page === 'dashboard' ? 'active' : ''} aria-current={page === 'dashboard' ? 'page' : undefined}>Dashboard</a>
      <a href="/course.html?course=git" className={page === 'courses' ? 'active' : ''} aria-current={page === 'courses' ? 'page' : undefined}>Courses</a>
      <a href="/#project">Project</a>
    </nav><div className="nav-user">{user ? <a className="profile-link" href="/profile.html"><span className="profile-avatar" aria-hidden="true">{user.display_name.slice(0, 1).toUpperCase()}</span><span>{user.display_name}</span></a> : <a className="sign-in-link" href="/login.html">Sign in <span aria-hidden="true">→</span></a>}</div>
  </div></header>;
}

function CurrentCourse({ course }: { course: CourseContent }) {
  return <section className="hero" aria-labelledby="current-course">
    <img className="hero-img" src={painted_panorama} width="1440" height="480" fetchPriority="high" alt="" />
    <div className="hero-body">
      <h2 className="hero-name" id="current-course">Start with {course.title}</h2>
      <p className="hero-next">{course.units.length} units. From your first command to recovering lost work.</p>
      <div className="hero-actions">
        <a className="btn" href={`/course.html?course=${course.id}`}>Start learning <span aria-hidden="true">→</span></a>
        <a className="link-quiet" href="#courses">Browse courses</a>
      </div>
    </div>
  </section>;
}

function CourseCard({ course }: { course: CourseContent }) {
  const git = course.id === 'git';
  return <article className="course">
    <div className="course-art"><img src={git ? painted_git : painted_github}
      alt={git ? 'Workspace with a warm desk lamp' : 'Workspace with a blue monitor'}
      width="960" height="640" loading="lazy" decoding="async" /></div>
    <div className="course-body">
      <h3 className="course-name"><a href={`/course.html?course=${course.id}`}>{course.title} <span className="course-open" aria-hidden="true">↗</span></a></h3>
      <p className="course-desc">{git ? 'Commits, branches, history, and recovery.' : 'Repositories, pull requests, reviews, and Actions.'}</p>
      <div className="course-foot"><span className="status">{course.units.length} units · {course.activity_count} activities</span></div>
    </div>
  </article>;
}

function LessonList({ course }: { course: CourseContent }) {
  return <section className="nodes" id="curriculum" aria-labelledby="curriculum-title">
    <div className="section-head"><h2 className="h2" id="curriculum-title">Your first steps in {course.title}</h2>
      <a className="section-note" href={`/course.html?course=${course.id}`}>View all {course.activity_count} activities →</a></div>
    {course.units[0].activities.slice(0, 5).map(activity => <div className="node" key={activity.id}>
      <span className="node-dot" aria-hidden="true" /><span className="node-title">{activity.title}</span>
      <span className="node-type">{activity.type}</span>
      <a className="node-meta is-action" href={`/course.html?course=${course.id}#${activity.id}`}>Open</a>
    </div>)}
  </section>;
}

function Project() {
  const firstStage = useRef<HTMLDetailsElement>(null);
  function startBuilding(event: MouseEvent<HTMLAnchorElement>) {
    if (!firstStage.current) return;
    event.preventDefault();
    firstStage.current.open = true;
    firstStage.current.scrollIntoView({ block: 'start' });
    window.history.replaceState(null, '', '#project-stage-1');
    firstStage.current.querySelector('summary')?.focus({ preventScroll: true });
  }
  return (<>
  <section className="project" id="project" aria-labelledby="project-title">
    <div className="project-build">
      <div className="project-feature">
        <img className="project-scene" src={painted_monitor} width="960" height="640" alt="Desk with a monitor overlooking a mountain valley" loading="lazy" decoding="async" />
        <div className="project-intro">
          <h2 id="project-title">Build your first<br />coding project.</h2>
          <p className="project-summary">Put Git and GitHub to work in a repository of your own.</p>
          <a className="btn project-start" href="#project-stage-1" onClick={startBuilding}>Start building <span aria-hidden="true">→</span></a>
        </div>
      </div>
      <div className="build-stages" aria-label="Project stages">
        <details ref={firstStage} className="build-stage is-ready" id="project-stage-1">
          <summary>
            <span className="stage-number" aria-hidden="true">01</span>
            <span className="stage-title">Set up your project<span className="stage-description">Create a local repository and make your first commit.</span></span>
            <span className="stage-state">Available after Git<span className="stage-expand" aria-hidden="true">+</span></span>
          </summary>
          <div className="stage-instructions">
            <h3>Start with a repository</h3>
            <p>Create a folder for your project, initialize Git, and commit a README that explains what you’re building.</p>
            <pre><code>{`mkdir coding-project
cd coding-project
git init
echo "# Coding project" > README.md
git add README.md
git commit -m "Start coding project"`}</code></pre>
            <p className="stage-outcome">You’re ready for the next stage when your README appears in your Git history.</p>
          </div>
        </details>
        <div className="build-stage is-locked" aria-label="Stage 2: Publish your repository. Locked until GitHub is complete.">
          <span className="stage-number" aria-hidden="true">02</span>
          <span className="stage-title">Publish your repository<span className="stage-description">Push your code to GitHub and open a pull request.</span></span>
          <span className="stage-state">Unlocks after GitHub</span>
        </div>

      </div>
    </div>
  </section>


  </>);
}


export function Dashboard({ courses }: { courses: CourseContent[] }) {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Navigation />
    <main id="main" className="wrap page-top">
      <div className="page-heading"><h1 className="h1">Your learning starts here</h1></div>
      <CurrentCourse course={courses[0]} />
      <div className="section-head courses-head" id="courses"><h2 className="h2">Your courses</h2></div>
      <div className="course-grid course-grid-two">{courses.map(course => <CourseCard key={course.id} course={course} />)}</div>
      <LessonList course={courses[0]} />
      <Project />
    </main>
  </>;
}
