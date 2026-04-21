# Abstract, Keywords, và tóm tắt chương (tiếng Anh)

## Abstract

Data structures such as stacks and queues are foundational in computer science curricula, yet many learners struggle to connect abstract definitions with dynamic behavior and typical applications. This project presents **Algoverse**, a single-page web application built with **React 19**, **TypeScript**, and **Vite**, complemented by **Tailwind CSS** for layout and **Framer Motion** for visual feedback. The system provides interactive visualizations for stack operations, infix-to-postfix transformation, queue operations, and breadth-first search (BFS) on a small graph. A practice module offers multiple-choice assessments on stack and queue concepts, with topic filtering and shuffled question sets. An **About** page renders the project’s Markdown documentation (the student report sources under `docs/bao-cao-do-an/`) inside the app, with section navigation and deep links via a `doc` query parameter. The client-side architecture uses lazy-loaded routes, a shared layout with light/dark theming, and clear separation between feature modules and shared UI. Unit tests cover core practice logic and an extended deterministic puzzle engine (seeded generation and judging) that is implemented in the codebase for future UI integration. The work demonstrates how lightweight modern front-end tooling can support algorithm education without a backend. Limitations include the absence of user accounts, server persistence, and full deployment of the puzzle track in the current user interface.

**Keywords:** data structures; stack; queue; BFS; visualization; React; TypeScript; e-learning

---

## Chapter summaries (English)

### Chapter 1 — Overview  
Introduces the learning problem, motivation for visual and interactive tools, scope of Algoverse/learner-app (visualizers, practice, and in-app Markdown documentation), the **methodology** used (analysis → design → implementation → testing → evaluation), a sample work plan table, and the report structure.

### Chapter 2 — Theoretical background  
Summarizes stacks, queues, infix/postfix expressions, BFS and the role of queues, and the main web technologies used (React, TypeScript, SPA routing, build tooling, basic testing concepts).

### Chapter 3 — Analysis and design  
Specifies functional and non-functional requirements (including the **About/documentation** feature), user flows, folder-level architecture (`features` vs `shared`), routing table, a suggested Mermaid architecture diagram, UI/theming, practice logic, and optional puzzle components.

### Chapter 4 — Implementation  
Describes toolchain versions from `package.json`, key routes and components, Markdown rendering with `react-markdown` and `remark-gfm`, algorithms at a high level (visualization and quiz flow), the tested puzzle module as future work; lists development, build, and test commands.

### Chapter 5 — Results and evaluation  
Outlines expected screenshots (including **About**), qualitative checks, a template table for technical metrics (build time, test count, `dist` size, optional Lighthouse), known limitations, and optional user-study ideas.

### Chapter 6 — Conclusion and future work  
Recaps contributions and proposes extensions such as integrating the puzzle UI, additional structures, persistence, or accessibility improvements.
