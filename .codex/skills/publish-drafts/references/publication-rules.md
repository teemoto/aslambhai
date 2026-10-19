# Publication rules

Use these rules while converting an approved draft into an article.

## Article file and frontmatter

- Write the article to `src/content/articles/<descriptive-kebab-case-slug>.mdx`.
- Follow naming patterns in nearby articles and preserve series naming when relevant.
- Do not overwrite an existing article without explicit authorization.
- Populate every field required by `src/content.config.ts`.
- Derive `title` from the article, and write a concrete search-friendly `description` that accurately states its value.
- Use the processing date for `publishedAt` unless the draft supplies a deliberate publication date.
- Calculate `minutes` from the finished readable prose at approximately 225 words per minute, rounded up. Exclude imports, frontmatter, and code from the word count. Respect the five-minute limit for `TIL` articles.
- Choose the closest established topic and an icon allowed by the schema. Do not expand the schema merely to accommodate one article.
- Default `featured` to `false`.
- Use `draft: false` unless unresolved high-severity feedback makes publication misleading.

## Cover image

- Generate `public/images/<article-slug>-cover.png` at the established cover ratio, normally 1672 by 941 pixels.
- Develop one clear editorial concept from the article's central idea. Match the site's restrained, conceptual visual system rather than producing generic technology imagery.
- Avoid embedded labels and prose unless comprehension genuinely requires them.
- Supply specific alt text that communicates the concept rather than repeating the title.
- Optimize the asset reasonably without sacrificing visible quality.

## Explicit image markers

Treat `<img: DESCRIPTION_IN_UPPERCASE>` as a private author instruction. Remove it from published prose and replace it with the most appropriate of:

1. A reusable existing article component.
2. A focused Astro/CSS visual in `src/components/articles/` for systems, sequences, comparisons, states, timelines, or UI anatomy.
3. A generated raster image when illustration, atmosphere, or visual storytelling is the primary value.

Infer a useful caption and accessible description from the surrounding argument. Do not expose the raw marker.

## Visual design language

- Inspect relevant existing components in `src/components/articles/` before creating a new one.
- Use semantic custom properties from `src/styles/tokens.css`; support every site theme through the same tokens.
- Prefer semantic HTML, CSS, and meaningful component names over generic primitives.
- Keep labels concise and preserve legibility at narrow widths without horizontal page overflow.
- Provide a figure caption or equivalent text. Mark purely decorative shapes as hidden from assistive technology.
- Respect reduced motion. Do not add animation unless it materially improves comprehension.
- Reuse a component only when its semantics match, not merely because its appearance is similar.

## ASCII, tables, and code

- Convert genuine ASCII architecture, flow, sequence, and relationship diagrams into accessible Astro/CSS visuals.
- Preserve directory trees, terminal output, data formats, and examples whose monospace structure is itself meaningful.
- Convert Markdown and raw HTML tables to `ComparisonTable` or an appropriately specialized accessible table component.
- Preserve executable and instructional code as fenced code so Astro's configured Shiki renderer provides syntax highlighting in light and dark themes.
- Add an accurate language identifier to each fence when known. Do not turn copyable code into an image.
- If a fenced block is actually a conceptual diagram or prose layout rather than code, convert it to a visual.

## Editorial handling

Apply spelling, grammar, punctuation, capitalization, broken Markdown, and obvious repetition corrections directly to the article. Preserve Tanvir's direct voice, avoid generic AI phrasing, and do not introduce em dashes.

Do not silently alter technical claims, conclusions, intended meaning, article organization, code behavior, or substantial sentence structure. Put those recommendations in the feedback file for approval.

When the article is part of a series, add useful links to existing related parts and update an older part's forward link only when that falls within the user's approved plan.

## Final inspection

Inspect the rendered article when visual work is substantial. Check desktop and mobile, light and dark themes, keyboard access, overflow, image loading, captions, and code scrolling. Keep changes scoped to the article and components it genuinely needs.
