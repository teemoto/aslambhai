# Feedback format

Create a feedback file only when substantive concerns exist. Use `src/content/feedback/<article-slug>.md` and this structure:

```markdown
# Feedback: <article title>

- Source: `src/content/drafts/<file>.md`
- Article: `src/content/articles/<slug>.mdx`
- Status: Pending author review

## Requires a decision

### [High | Medium | Low] <short issue label>

- Location: <heading and a short identifying excerpt>
- Concern: <what may be incorrect, unclear, or structurally weak>
- Why it matters: <reader or technical consequence>
- Recommendation: <specific proposed direction>
- Sources: <authoritative links when verification was needed>
- Status: Pending
```

Group items under the applicable headings:

- Technical accuracy
- Meaning or argument
- Structural clarity
- Suggested additions
- Requires verification

Omit empty groups. Quote only the minimum text needed to identify a location. Do not use the feedback file for mechanical corrections already made in the article.

Severity means:

- **High:** likely materially incorrect, unsafe, or misleading. Keep the article at `draft: true` until resolved.
- **Medium:** meaningful clarity, reasoning, or completeness issue that deserves a decision but does not make the article misleading.
- **Low:** optional substantive improvement that would change more than mechanics.
