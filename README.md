# Front-End Interview Hub

A focused learning platform built around 14 real front-end interview questions. Each question is expanded into a self-contained module with in-depth explanations, code examples, interactive quizzes, and curated resources.

## Topics Covered

- **CMS & Theming** — CMS experience, custom modules, theme customization
- **CSS Fundamentals** — Methodologies (BEM, Tailwind), specificity, Grid vs Flexbox
- **Accessibility & HTML** — WCAG, ARIA, semantic markup, assistive technology
- **Debugging & Production** — Systematic debugging, production bug resolution
- **Professional Practices** — Staying current, documentation, code quality
- **Experience & Problem-Solving** — Project showcase, complex UI/UX challenges

## Tech Stack

- [Astro 5](https://astro.build) — Static site generator
- [Tailwind CSS v4](https://tailwindcss.com) — Utility-first CSS
- GitHub Pages — Deployment via GitHub Actions

## Project Structure

```
src/
  content/modules/    # 14 module markdown files (rich YAML frontmatter)
  data/
    modules-meta.json # Module metadata (slugs, topics, difficulty)
    topic-groups.json # Topic grouping configuration
    glossary.json     # 49 glossary terms
    resources.json    # 33 curated resources in 6 categories
    quizzes/          # 14 quiz JSON files (5-7 questions each)
  components/
    global/           # Header, Footer, Breadcrumbs, DarkModeToggle
    home/             # ModuleCard
    module/           # QuestionHeader, CoreExplanation, KeyConcepts,
                      # CodeExample, PitfallsSection, CaseStudy,
                      # QuizSection, FurtherReading
  layouts/            # BaseLayout, ModuleLayout, PageLayout
  pages/              # index, modules/[slug], glossary, resources, about, 404
```

## Features

- 14 in-depth learning modules with quizzes
- Dark mode with system preference detection
- Client-side glossary search
- Topic-based filtering on homepage
- Responsive design with mobile navigation
- Code examples with syntax highlighting and copy button
- Quiz scores saved to localStorage

## Commands

| Command            | Action                                      |
| :----------------- | :------------------------------------------ |
| `npm install`      | Install dependencies                        |
| `npm run dev`      | Start dev server at `localhost:4321`         |
| `npm run build`    | Build production site to `./dist/`           |
| `npm run preview`  | Preview build locally before deploying       |
