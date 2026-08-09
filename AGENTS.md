# Aslam Bhai engineering rules

These rules apply to all future work in this repository.

Read `docs/PROJECT_CONTEXT.md` before planning or changing this repository.

## Architecture

1. This is a static, content-first website. Keep `output: "static"` unless a real requirement makes server rendering necessary.
2. Astro handles publishing, routes, layouts, and content. HTML and CSS are the defaults.
3. Add browser JavaScript only for a specific interaction. Add React only when an individual feature genuinely needs complex state.
4. Do not add a database, ORM, authentication, API layer, server runtime, or CMS speculatively.
5. Prefer a small clear implementation over a dependency. Add a package only when it meaningfully reduces complexity or risk.

## Components

6. Pages compose components and should contain little implementation detail.
7. Layouts own shared document structure and metadata.
8. Content files contain writing and frontmatter, not presentation logic.
9. Extract a component when it is repeated, has its own behavior, or represents a meaningful named section. Do not abstract one-off markup.
10. Avoid generic `Box`, `Stack`, `Text`, and similar design-system primitives. Use semantic HTML and descriptive classes.
11. Keep components focused, typed, accessible, and readable without hidden conventions.

## Styling and experience

12. Preserve the locked visual design and responsive behavior unless the user explicitly approves a change.
13. Use plain CSS and shared custom properties from `src/styles/tokens.css`. Prefer component-scoped styles only when they improve ownership.
14. Light and dark themes must use the same semantic tokens.
15. Maintain keyboard access, visible focus, semantic landmarks, reduced-motion support, and readable article typography.
16. Keep the site mobile-friendly, SEO-friendly, and usable offline.

## Content and quality

17. Articles live in `src/content/articles/` and must satisfy the schema in `src/content.config.ts`.
18. Generate article routes, lists, RSS, and metadata from content rather than duplicating article data.
19. Keep Giscus as the comments and reactions provider unless a concrete requirement justifies replacing it.
20. Before handing off a change, run `npm run check` and `npm test`. Do not keep generated output or obsolete scaffolding in source control.
