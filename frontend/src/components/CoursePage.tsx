import { useEffect, useState, type FormEvent } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Activity, CourseContent, QuizResult } from '../content/types';
import { TerminalPanel } from '../terminal/TerminalPanel';
import '../../css/course.css';

function courseLink(course: CourseContent, id: string) {
  return `/course.html?course=${course.id}#${id}`;
}

function Content({ text, courses }: { text: string; courses: CourseContent[] }) {
  return <div className="course-markdown"><Markdown skipHtml remarkPlugins={[remarkGfm]} components={{
    a: ({ href, children }) => {
      if (href?.startsWith('#')) {
        const id = href.slice(1);
        const owner = courses.find(candidate => candidate.lessons[id] || candidate.units.some(unit => unit.activities.some(activity => activity.id === id)));
        if (owner) href = courseLink(owner, id);
      }
      return <a href={href}>{children}</a>;
    },
  }}>{text}</Markdown></div>;
}

function Quiz({ activity, course, courses, onComplete }: { activity: Activity; course: CourseContent; courses: CourseContent[]; onComplete?: (activityId: string) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`/api/curriculum/${course.id}/quizzes/${activity.id}/check`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answers }),
      });
      if (!response.ok) throw new Error('We could not check your answers. Please try again.');
      const checked = await response.json() as QuizResult;
      setResult(checked);
      if (checked.passed) onComplete?.(activity.id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return <form onSubmit={submit} className="quiz-form">
    <p>Choose one answer per question. Aim for at least 2 of 3 correct, then review any missed explanations.</p>
    {activity.questions?.map((question, index) => {
      const feedback = result?.results.find(item => item.id === question.id);
      return <fieldset key={question.id} disabled={!!result || busy}>
        <legend>Question {index + 1}</legend>
        <Content text={question.prompt} courses={courses} />
        {question.options.map(option => <label className="quiz-option" key={option.id}>
          <input type="radio" name={question.id} value={option.id} checked={answers[question.id] === option.id}
            onChange={() => setAnswers({ ...answers, [question.id]: option.id })} required />
          <span><strong>{option.id}.</strong> {option.text}</span>
        </label>)}
        {feedback && <div className="quiz-feedback">
          <strong>{feedback.passed ? 'Correct' : `Correct answer: ${feedback.correct}`}</strong>
          <Content text={feedback.explanation} courses={courses} />
          {!feedback.passed && <Content text={`Review: ${feedback.review}`} courses={courses} />}
        </div>}
      </fieldset>;
    })}
    {error && <p role="alert">{error}</p>}
    {result ? <div role="status" className="quiz-result">
      <p><strong>{result.score} of {result.total} correct.</strong> {result.passed ? 'You reached the suggested score.' : 'Review the linked lessons, then try again.'}</p>
      <button className="workspace-action" type="button" onClick={() => { setAnswers({}); setResult(null); }}>Try again</button>
    </div> : <button className="workspace-action primary" disabled={busy || Object.keys(answers).length !== activity.questions?.length}>{busy ? 'Checking…' : 'Check answers'}</button>}
  </form>;
}

function InstructionContent({ activity, course, courses, showLesson, onComplete }: {
  activity: Activity; course: CourseContent; courses: CourseContent[]; showLesson: boolean; onComplete?: (activityId: string) => void;
}) {
  const lesson = activity.lesson_id ? course.lessons[activity.lesson_id] : null;
  return <>
    {lesson && <details className="lesson-review" open={showLesson || undefined}>
      <summary>Mini lesson · {lesson.title}</summary>
      <Content text={lesson.body} courses={courses} />
    </details>}
    {activity.type === 'quiz' ? <Quiz key={activity.id} activity={activity} course={course} courses={courses} onComplete={onComplete} /> : <>
      <p className="practice-intro">Practice problem · {activity.response}. Use the prepared files and terminal in the workspace.</p>
      {activity.sections?.map(section => {
        const expandable = /hint|author answer|feedback/i.test(section.title);
        return expandable ? <details className="instruction-disclosure" key={section.title}>
          <summary>{section.title.replace('Author answer / one acceptable approach', 'Show a possible solution')}</summary>
          <Content text={section.body} courses={courses} />
        </details> : <section className="instruction-section" key={section.title}>
          <h3>{section.title}</h3><Content text={section.body} courses={courses} />
        </section>;
      })}
    </>}
  </>;
}

export function CoursePage({ courses }: { courses: CourseContent[] }) {
  const courseId = new URLSearchParams(window.location.search).get('course') || 'git';
  const course = courses.find(candidate => candidate.id === courseId);
  const [hash, setHash] = useState(window.location.hash.slice(1));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState<'instructions' | 'workspace'>('instructions');
  const [workspaceFocused, setWorkspaceFocused] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(`code-practice-completed:${courseId}`) ?? '[]') as string[]); }
    catch { return new Set(); }
  });

  function markComplete(activityId: string) {
    setCompleted(current => {
      const next = new Set(current).add(activityId);
      try { localStorage.setItem(`code-practice-completed:${courseId}`, JSON.stringify([...next])); } catch { /* Keep completion usable for this visit. */ }
      return next;
    });
  }

  useEffect(() => {
    const update = () => { setHash(window.location.hash.slice(1)); setMobileView('instructions'); setWorkspaceFocused(false); };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useEffect(() => {
    document.body.classList.add('course-workspace-body');
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') { setSidebarOpen(false); setWorkspaceFocused(false); } };
    document.addEventListener('keydown', close);
    return () => { document.body.classList.remove('course-workspace-body'); document.removeEventListener('keydown', close); };
  }, []);

  const activities = course?.units.flatMap(unit => unit.activities) ?? [];
  const activity = activities.find(item => item.id === hash) ?? activities.find(item => item.lesson_id === hash) ?? (!hash ? activities[0] : undefined);
  const unit = course?.units.find(candidate => candidate.activities.some(item => item.id === activity?.id));
  const index = activities.findIndex(item => item.id === activity?.id);
  const firstLessonTask = activity?.lesson_id && activities.find(item => item.lesson_id === activity.lesson_id)?.id === activity.id;
  const previous = index > 0 ? activities[index - 1] : null;
  const next = index >= 0 && index < activities.length - 1 ? activities[index + 1] : null;
  const progress = course ? (completed.size / course.activity_count) * 100 : 0;

  useEffect(() => {
    document.title = `${course?.title ?? 'Course not found'} — Code Practice`;
    document.getElementById('lesson-title')?.focus({ preventScroll: true });
  }, [course, hash]);

  if (!course || !activity || !unit) return <main className="wrap page-top"><h1>Course not found</h1><a href="/course.html?course=git">Open the Git course</a></main>;

  return <div className={`course-shell ${sidebarOpen ? 'sidebar-open' : ''} ${workspaceFocused ? 'workspace-focused' : ''} mobile-${mobileView}`}>
    <a className="skip-link" href="#instructions">Skip to instructions</a>
    <header className="workspace-header">
      <div className="header-left">
        <button className="sidebar-toggle icon-button" type="button" aria-expanded={sidebarOpen} aria-controls="course-sidebar" aria-label={sidebarOpen ? 'Collapse course sidebar' : 'Expand course sidebar'} onClick={() => setSidebarOpen(!sidebarOpen)}><span className="panel-icon" aria-hidden="true" /></button>
        <a className="workspace-wordmark" href="/"><span className="door" aria-hidden="true" />Courses</a>
      </div>
      <div className="top-progress">
        <span className="top-progress-label">{course.title}</span>
        <div className="top-progress-track" role="progressbar" aria-label="Course completion" aria-valuenow={completed.size} aria-valuemin={0} aria-valuemax={course.activity_count}><div className="top-progress-fill" style={{ width: `${progress}%` }} /></div>
        <span className="progress-count">{completed.size} / {course.activity_count}</span>
      </div>
      <a className="back-link" href="/">Dashboard <span aria-hidden="true">↗</span></a>
    </header>

    <div className="course-frame">
      <aside id="course-sidebar" className="course-sidebar" aria-label="Course lessons">
        <div className="sidebar-heading"><span className="season">Git & GitHub</span><h1>{course.title}</h1><p>{course.activity_count} activities</p></div>
        <nav className="lesson-navigation" aria-label="Course outline">
          <p className="nav-label">Course outline</p>
          {course.units.map(courseUnit => <details key={courseUnit.id} open={courseUnit.id === unit.id}>
            <summary><span>Unit {courseUnit.number}</span>{courseUnit.title}</summary>
            {courseUnit.activities.map((item, activityIndex) => <a key={item.id} className={`course-lesson ${item.id === activity.id ? 'selected' : ''}`} href={courseLink(course, item.id)} aria-current={item.id === activity.id ? 'step' : undefined} onClick={() => setSidebarOpen(false)}>
              <span className={`lesson-state ${completed.has(item.id) ? 'complete' : ''}`} aria-hidden="true">{completed.has(item.id) ? '✓' : String(activityIndex + 1).padStart(2, '0')}</span><span>{item.title}<small>{item.type}</small></span>
            </a>)}
          </details>)}
        </nav>
        <div className="sidebar-footer"><a href="/">← All courses</a></div>
      </aside>

      <main className={`learning-area ${activity.type === 'quiz' ? 'quiz-mode' : ''}`}>
        <nav className="mobile-views" aria-label="Workspace view">
          <button className={mobileView === 'instructions' ? 'active' : ''} type="button" aria-pressed={mobileView === 'instructions'} onClick={() => { setMobileView('instructions'); setWorkspaceFocused(false); }}>Instructions</button>
          {activity.type !== 'quiz' && <button className={mobileView === 'workspace' ? 'active' : ''} type="button" aria-pressed={mobileView === 'workspace'} onClick={() => { setMobileView('workspace'); setWorkspaceFocused(false); }}>Workspace</button>}
        </nav>
        <section id="instructions" className="instructions-pane" aria-labelledby="lesson-title">
          <header className="pane-header"><span>Instructions</span><span className="lesson-kind">{activity.type}</span></header>
          <div className="instruction-scroll">
            <div className="lesson-copy">
              <div className="lesson-position">{course.title} / Unit {unit.number} / {String(index + 1).padStart(2, '0')}</div>
              <h2 id="lesson-title" tabIndex={-1}>{activity.title}</h2>
              <InstructionContent key={activity.id} activity={activity} course={course} courses={courses} showLesson={!!firstLessonTask || !!course.lessons[hash]} onComplete={markComplete} />
            </div>
          </div>
          <footer className="instruction-footer">
            {previous ? <a href={courseLink(course, previous.id)}>← Previous</a> : <a href="/">← Dashboard</a>}
            <span>{index + 1} of {course.activity_count}</span>
            {next ? <a className="next" href={courseLink(course, next.id)}>Next <span aria-hidden="true">→</span></a> : <a className="next" href={course.id === 'git' ? '/course.html?course=github' : '/'}>{course.id === 'git' ? 'GitHub' : 'Dashboard'} <span aria-hidden="true">→</span></a>}
          </footer>
        </section>
        {activity.type !== 'quiz' && <TerminalPanel key={`${course.id}-${activity.id}`} activity={activity} courseId={course.id} focused={workspaceFocused} onFocusChange={setWorkspaceFocused} onComplete={markComplete} />}
      </main>
    </div>
  </div>;
}
