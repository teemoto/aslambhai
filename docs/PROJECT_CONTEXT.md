# Project context

Last updated: August 4, 2026

## Purpose

Aslam Bhai is Tanvir Aslam's public technical-writing and project platform. It is part of Anabasis, a year-long program focused on deep engineering learning, shipping useful products, preparing for Principal or Senior Staff roles, building a respected public brand, and creating the possibility of a second income stream.

Tanvir has at most three hours a day alongside a full-time job and a toddler. Favor focused scope, weekly shipping, and learning through real deliverables over endless polish cycles.

The primary audience is mid-level and senior frontend engineers. Content covers frontend architecture and resilience, applied AI for engineers, ad tech, technical deep dives, and concise TIL posts. Preserve Tanvir's direct voice. Avoid fluff, generic AI phrasing, and em dashes.

## Product direction

- Keep the site static-first, content-first, and dependency-light.
- Preserve the established Aslam Bhai visual identity and responsive behavior.
- The homepage emphasizes published articles. Core sections are Home, Projects, and About.
- Publishing remains Git-based until a concrete requirement justifies a CMS integration.
- GitHub Pages deploys every push to `main`. `tanviraslam.com` is the canonical domain; `aslambh.ai` permanently redirects to it.
- Do not publish placeholder articles or simulated content.
- External links open in a new tab where appropriate.

## Article decisions

The first flagship article is `The Art of Resilient Frontends - Part 1: Mental Model`. Its ECORE framework means Expect failure, Contain failure, Observe failure, Recover, and Evolve. These are overlapping disciplines, not a rigid incident sequence.

Established layout decisions:

- Keep the desktop prose column near 820px. The wider 900px prose / 1040px canvas experiment was rejected.
- The article header may use a larger editorial canvas while the body remains narrower.
- The global header stays fixed while scrolling articles, with the progress line beneath it.
- Byline icons and text are aligned with deliberate spacing.
- Desktop share tools remain visible while scrolling and show animated labels on hover.
- Preserve responsive mobile behavior and prevent horizontal overflow.
- Make one focused visual change at a time and preview it before broader redesign.

## Editorial workflow

For substantial articles:

1. Tanvir writes the original draft.
2. Codex critiques structure, reasoning, accuracy, clarity, and voice.
3. Tanvir performs one revision.
4. Codex owns the publication-ready pass.
5. Codex produces a companion learnings document with reusable lessons.

Favor a strong finished piece over endless polishing. Most articles should complete within one week.

## Sakka

Sakka is a separate future open-source CMS project that will eventually support Git-backed publishing. Do not add Sakka implementation to this site unless a task explicitly begins that work.

## Definition of done

- Complete the requested behavior without unrelated redesign.
- Keep components modular, accessible, responsive, and maintainable.
- Run `npm run check` and `npm test` after code changes.
- Verify substantial UI work on desktop and mobile.
- Update this file when a durable product or workflow decision changes.
