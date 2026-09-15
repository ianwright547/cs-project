export type Question = { id: string; prompt: string; options: { id: string; text: string }[] };
export type Activity = {
  id: string;
  title: string;
  type: 'practice' | 'checkpoint' | 'quiz';
  response?: string;
  lesson_id?: string | null;
  sections?: { title: string; body: string }[];
  questions?: Question[];
};
export type CourseContent = {
  id: 'git' | 'github';
  title: string;
  activity_count: number;
  units: { id: string; number: number; title: string; activities: Activity[] }[];
  lessons: Record<string, { id: string; title: string; body: string }>;
};
export type QuizResult = {
  score: number; total: number; passed: boolean;
  results: { id: string; correct: string; passed: boolean; explanation: string; review: string }[];
};
