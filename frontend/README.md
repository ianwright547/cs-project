# Code Practice frontend

React + TypeScript, built with Vite. The original CSS, artwork, and dashboard layout are preserved.

```bash
cd frontend
npm ci
npm run dev
```

Open http://localhost:5173. `/dashboard.html` remains supported. Vite proxies `/api` and `/health` to FastAPI on port 8000.

```bash
npm run build     # TypeScript checks, then production assets in dist/
npm run preview   # Preview the production build
```

## Files

- `src/main.tsx`: React entry point and global stylesheet import.
- `src/components/Dashboard.tsx`: navigation, current course, typed course cards, progress rings, lessons, and project components.
- `css/dashboard.css`: existing approved stylesheet, unchanged.
- `assets/`: original artwork and fonts, bundled by Vite.
- `index.html` / `dashboard.html`: small HTML shells that load React.

Git and GitHub courses load from `git-github-curriculum.md` through FastAPI. Open `/course.html?course=git` or `/course.html?course=github`. The dashboard shows real activity counts. Quizzes can be checked, and practical tasks show instructions with expandable hints/solutions. Saved account progress and practical grading are not connected yet.

For the complete app with PostgreSQL, run `docker compose up --build -d` from the repository root and open http://localhost:8000.
