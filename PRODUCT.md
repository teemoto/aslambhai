# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary audience is mid-level and senior frontend engineers. They arrive to understand a technical subject, evaluate Tanvir's engineering perspective, and explore related writing or projects.

The primary visitor journey is to read a useful article first, then discover Tanvir's broader expertise, projects, and professional background.

## Product Purpose

`tanviraslam.com` is Tanvir Aslam's public technical-writing and project platform. It makes complex frontend architecture, applied AI, ad technology, and engineering-leadership topics easier to understand through practical, first-principles explanations.

The site supports Tanvir's long-term growth toward Principal or Senior Staff engineering roles and builds a respected public professional reputation. Creating opportunities for independent product income is a secondary long-term goal.

## Positioning

The site offers first-principles explanations of complex frontend, AI, and ad-tech systems grounded in senior engineering experience. Articles emphasize why a technology or pattern exists, the constraints that shaped it, where it breaks, and how engineers should reason about its tradeoffs.

## Operating Context

- Articles and project updates are authored in the repository and published through Git.
- Astro generates the static site, article routes, lists, metadata, RSS feed, and sitemap.
- GitHub Pages deploys every push to `main`.
- The canonical domain is `tanviraslam.com`; `aslambh.ai` redirects to it.
- Substantial articles follow a draft, critique, author revision, publication pass, and reusable-learnings workflow.

## Capabilities and Constraints

- The website is static-first, content-first, dependency-light, mobile-friendly, SEO-friendly, and usable offline.
- Published articles live in `src/content/articles/` and are the homepage's primary content.
- Core public sections are Home, Projects, About, Resume, and RSS.
- About offers a readable profile and a separate safe pseudo-terminal experience.
- Articles, projects, and public claims must reflect real work; do not publish placeholders, simulated content, fabricated evidence, or speculative capabilities.
- Publishing remains Git-based until a concrete requirement justifies a CMS.
- Keep Giscus as the comments and reactions provider unless a concrete requirement justifies replacing it.

## Brand Commitments

- The primary public identity is **Tanvir Aslam**.
- Use **Tanvir Aslam Mohammed** where the legal or full name is appropriate, including the public resume.
- The public descriptor is **Frontend Engineer / Technical Writer**.
- The voice is direct, concrete, practical, and technically rigorous. Avoid fluff, generic AI phrasing, and em dashes.
- Preserve Tanvir's established editorial identity and responsive behavior unless a redesign is explicitly approved.
- The former “Aslam Bhai” identity may remain only in technical identifiers where renaming would add unnecessary risk, such as the repository name, local directory, package name, Giscus configuration, and legacy redirect domain.

## Evidence on Hand

- Published technical articles in `src/content/articles/`.
- Working project descriptions and links on the Projects page.
- Professional background and focus areas in `src/data/about.ts`.
- Public resume at `public/resume/tanvir-aslam-mohammed-resume.pdf`.
- Brand mark, avatar, and social card in `public/brand/`.
- Article illustrations and diagrams in `public/images/` and `src/components/articles/`.
- No testimonials, client logos, audience metrics, revenue claims, or other third-party proof are currently established; future work must not fabricate them.

## Product Principles

1. Teach through first principles, real constraints, and meaningful tradeoffs.
2. Put useful published writing before self-promotion.
3. Build professional trust with concrete work and honest evidence.
4. Prefer focused scope and regular shipping over endless polish.
5. Keep ownership durable through static output, portable content, and a Git-based workflow.

## Accessibility & Inclusion

Maintain keyboard access, visible focus, semantic landmarks and heading order, reduced-motion support, readable article typography, meaningful alternative text, and responsive layouts without horizontal overflow.
