# Website milestones

## Milestone 1 — Honest launch surface

Completed July 27, 2026.

- Incomplete demonstration articles are drafts and do not appear in production, RSS, or the sitemap.
- Nonfunctional newsletter and Dispatch promotion were removed until a real subscription workflow exists.
- The nonfunctional sort control and placeholder project-detail links were removed.
- Project percentages were replaced by meaningful lifecycle states: Exploring, Building, and Usable alpha.
- The experimental service worker was removed, and existing registrations are retired for returning visitors.

Next: Milestone 2 — complete reading experience.

## Editorial decisions

Recorded July 27, 2026.

### Publication standard

- Keep each article to an 8–10 minute read. Split longer subjects into focused parts with one thesis each.
- Explain why an approach exists, the problem it solved, its history, and its tradeoffs—not merely how to use an API.
- Ground articles in real engineering experience and practical judgment.
- Use diagrams, sketches, code comparisons, tables, timelines, and other explanatory visuals whenever they communicate better than prose.
- Avoid text-heavy articles and generic, run-of-the-mill tutorials.
- Stop expanding the editorial framework for now; learn from writing and publishing the first articles.

### Initial article direction

1. **The Real Problem Microfrontends Solve Is Organizational** — an experience-backed frontend architecture essay about coordination costs, independent delivery, and the tradeoffs introduced by microfrontends.
2. **Why React Hooks Exist: The Problems React Was Trying to Escape** — a historical and conceptual frontend essay following the progression from mixins through higher-order components and render props to Hooks.
3. **Ad Tech 101 for Engineers** — a multipart, systems-oriented series for engineers with no advertising background. Each installment should remain independently useful and within the 10-minute limit.

The Ad Tech series begins with **How an Ad Gets on a Web Page**, following one impression from page load through the ad request, auction, creative render, and measurement. Later parts will introduce ecosystem participants, auction mechanics, header bidding, identity, post-auction rendering, reporting discrepancies, and the distributed-systems characteristics of ad tech.

## Deferred enhancements

### Public article read counts

Record this for a later phase, after analytics is enabled and readership is meaningful.

- Consider a subtle article-level label such as **“Read 1,284 times.”**
- Prefer article read counts over a prominent site-wide visitor ticker; the article count provides useful context, while a total counter is mostly a vanity metric.
- Treat the number as an approximate aggregate, not an exact count of unique people.
- Use a hosted counter or analytics service that can safely expose public aggregates so the static site does not need a custom application server.
- If Google Analytics is the private analytics source, exposing counts publicly will require a small serverless endpoint with authenticated API access and caching. Never put analytics credentials in browser code.
- Revisit this only after the custom domain and initial analytics setup are complete.
