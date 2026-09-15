import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import '../css/dashboard.css';
import { applyMotionPreference, migrateSavedWork, readPreference } from './preferences';

migrateSavedWork();
applyMotionPreference(readPreference('code-practice.reduced-motion') === '1');

createRoot(document.getElementById('root')!).render(
  <StrictMode><App /></StrictMode>,
);
