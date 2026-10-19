---
name: publish-drafts
description: Publish one specified draft or all newly discovered drafts from src/content/drafts as polished MDX articles for tanviraslam.com. Use only when explicitly invoked after the author has completed a draft.
---

# Publish Drafts

Turn completed source drafts into publication-ready site articles while preserving the source files and the author's decisions.

## Invocation

This skill is explicit-only. Accept either:

- No path: discover every new draft.
- One or more draft paths: process exactly those files, even if already recorded.

Start in the repository root. Read `AGENTS.md` and `docs/PROJECT_CONTEXT.md` before planning or changing files.

## Discover drafts

Run:

```bash
node .codex/skills/publish-drafts/scripts/draft-state.mjs scan
```

For explicit paths, append one `--file <path>` argument per path. The script compares source hashes against `.codex/state/draft-publication.json` and classifies drafts as `new`, `changed`, or `unchanged`.

- With no explicit path, select all `new` drafts.
- Report `changed` drafts, but do not update their articles without explicit authorization.
- Ignore `unchanged` drafts.
- With explicit paths, select those paths and show their recorded status. Never silently overwrite an existing article.

If the ledger is missing or invalid, stop before modifying content and explain that it must be restored or deliberately bootstrapped. Do not infer that every file is new.

## Prepare a publication plan

Inspect every selected draft and the closest existing articles and visual components. Before editing, present one consolidated plan containing, for each draft:

- Proposed article path and any collision.
- Proposed title, description, publication date, reading time, topic, and icon.
- Cover concept and destination.
- Every `<img: ...>` marker, ASCII diagram, table, and conceptual visual opportunity.
- Proposed reusable or new Astro visual components.
- Technical, structural, or meaning-level concerns.

Wait for one approval of this plan. After approval, process all selected drafts unless the user narrows the scope.

## Create each article

Read [references/publication-rules.md](references/publication-rules.md) and follow it completely. Key invariants:

- Never edit, move, rename, or delete the source draft.
- Correct mechanical spelling, grammar, punctuation, and formatting errors in the article.
- Preserve the author's voice, intent, opinions, and organization unless a substantive change is approved.
- Keep real code as correctly labelled fenced code rendered by the site's existing Shiki setup.
- Turn explicit image markers, conceptual ASCII diagrams, and suitable explanatory structures into accessible visuals using the site's established design language.
- Render tabular information with the existing `ComparisonTable` component.
- Generate an editorial cover image and meaningful alt text.
- Do not add dependencies unless a concrete requirement makes one necessary.

## Separate feedback from corrections

Directly fix only mechanical editorial errors and unambiguous formatting defects. For technical errors, major sentence reformulations, meaning changes, structural recommendations, or uncertain claims:

1. Preserve the draft's meaning in the generated article.
2. Create `src/content/feedback/<article-slug>.md` using [references/feedback-format.md](references/feedback-format.md).
3. Do not apply the proposed substantive change until the user approves it.
4. Set `draft: true` when an unresolved high-severity technical issue would make publication misleading. Otherwise use `draft: false`.

Use authoritative primary sources when technical verification requires current or precise information. Link those sources in the feedback file.

## Validate and record

For every completed article, confirm:

- No `<img: ...>` instruction remains.
- No convertible ASCII diagram remains.
- Tables use the established component.
- Code fences declare the correct language where one is known.
- Imports, image paths, dimensions, captions, and alt text are valid.
- Frontmatter satisfies `src/content.config.ts`.
- The page is accessible, responsive, and coherent in light and dark themes.

Then run:

```bash
npm run check
npm test
```

Only after the article is accepted by the user and validation passes, record it:

```bash
node .codex/skills/publish-drafts/scripts/draft-state.mjs record \
  --file "src/content/drafts/example.md" \
  --article "src/content/articles/example.mdx"
```

Recording acceptance, rather than initial generation, ensures a rejected or incomplete article remains discoverable. Never commit or push unless explicitly requested.
