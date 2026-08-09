# Aslam Bhai

A static, content-first personal publishing site built with Astro.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the local development server
- `npm run check` — validate Astro and TypeScript
- `npm test` — build and test the generated site

## Publishing an article

1. Add an `.md` or `.mdx` file to `src/content/articles/`.
2. Fill in the frontmatter shown in the existing articles.
3. Write the article beneath the frontmatter.
4. Run `npm run dev` to preview it.

Routes, article lists, RSS, metadata, and the sitemap are generated from the content collection. See `AGENTS.md` for the project's maintenance rules.
