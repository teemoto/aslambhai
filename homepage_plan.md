The plan should treat this as a homepage redesign plus a public-facing rebrand. Other page layouts remain unchanged, but shared branding must update everywhere to avoid showing “Tanvir Aslam” on the homepage and “Aslam Bhai” in article titles, metadata, or the PWA.

## Brand direction

Primary public identity:

- **Name:** Tanvir Aslam
- **Header descriptor:** Frontend Engineer / Technical Writer
- **Site title:** Tanvir Aslam — Frontend Architecture, AI, and Ad Tech
- **Canonical domain:** `tanviraslam.com`
- **Monogram:** Replace `AB` with `TA`
- **Public résumé name:** Keep “Tanvir Aslam Mohammed” where the legal/full name is appropriate

“Aslam Bhai” should disappear from public-facing content. It can remain temporarily in technical identifiers where renaming would create unnecessary risk:

- GitHub repository name
- Local repository directory
- Giscus repository configuration
- Package name, unless we deliberately rename it later
- `aslambh.ai` redirect

## Step-by-step homepage plan

### Step 1: Establish the rebrand foundation

**Status: Complete.**

Update the shared identity before restructuring the homepage:

- Change `site.name`, page titles, metadata, RSS title, manifest, and social metadata.
- Update the shared header and footer.
- Replace the `AB` monogram with a new `TA` mark using the existing editorial style.
- Regenerate favicons, app icons, and the social sharing card.
- Rename public brand asset paths from `aslam-bhai-*` to `tanvir-aslam-*`.
- Replace public-facing “Aslam Bhai” references in About, Projects, RSS, résumé titles, and 404 copy without redesigning those pages.
- Update tests and project documentation.

Proposed header:

```
TA   Tanvir Aslam
     Frontend Engineer / Technical Writer
```

Navigation for this homepage-only phase:

```
Projects    About    RSS    Theme
```

The logo and name become the home link, so a separate Home item is unnecessary.

Checkpoint: review the rebranded header, monogram, light theme, and dark theme before touching the homepage body.

### Step 2: Remove the current identity-banner experiment

**Status: Complete.**

The uncommitted identity block should not remain above the new editorial hero.

We will:

- Remove the bordered top identity card.
- Keep the generated portrait temporarily.
- Reuse that portrait in the homepage author sidebar.
- Ensure the author’s name remains visible on mobile through the masthead rather than relying on a desktop-only tagline.

Checkpoint: homepage begins directly with the editorial lead story.

### Step 3: Build the featured/latest editorial section

**Status: Implemented, awaiting visual review.**

Replace the existing featured section with a two-column composition.

Desktop:

```
┌──────────────────────────────┬──────────────────────────┐
│ Featured cover               │ Latest writing           │
│                              │ 01 Latest article        │
│ Metadata                     │ 02 Article               │
│ Featured headline            │ 03 Article               │
│ Description                  │ 04 Article               │
└──────────────────────────────┴──────────────────────────┘
```

Behavior:

- Use the featured article as the initial lead.
- Populate the right side from the four most recently published articles.
- Use accessible buttons for selecting another lead story.
- Update the image, title, metadata, description, and destination.
- Render the content in HTML so the initial story works without JavaScript.
- Use a very small progressive-enhancement script for selection.
- Do not introduce automatic rotation initially.
- Use an active underline or progress-like marker without animation.

Mobile:

- Show the lead cover, metadata, title, and description.
- Replace the large right column with a compact horizontally scrollable latest-story selector.
- Keep titles visible rather than reducing navigation to ambiguous dots.

Checkpoint: desktop and mobile hero review before building the remainder of the page.

### Step 4: Create a reusable article-cover system

Only one current article has a dedicated cover. A card-based homepage needs a coherent fallback system.

Create a reusable `ArticleCover` component:

- Use an existing cover when one is supplied.
- Otherwise generate a deterministic visual from:
  - Article title
  - Topic
  - Article icon
  - Topic accent color
  - Series marker such as `TIL` or `WTF`
- Keep fallback artwork code-native with HTML/CSS or SVG.
- Avoid generic AI imagery for every article.
- Preserve the existing visual language used by article diagrams.
- Maintain a consistent 16:9 ratio.
- Provide useful alternative text for editorial images and empty alt text for purely decorative fallback artwork.

This component will support the hero and the article feed.

Checkpoint: compare real and fallback covers together to ensure the fallback does not look secondary.

### Step 5: Upgrade the topic and search rail

Retain the current discovery controls but make them more informative:

- Add article counts.
- Give each subject a restrained accent color.
- Keep search compact and expandable.
- Keep topic controls horizontally scrollable on mobile.
- Continue filtering the homepage locally for now.

Proposed subjects:

- Frontend
- AI
- Ad Tech
- Leadership

`TIL` and `WTF` are formats rather than subject areas. For this homepage phase, visually separate them as series filters while preserving their existing behavior.

We should not create `/topics` routes yet. The controls can become links when topic pages are introduced later.

Checkpoint: verify filtering and search with the new feed before proceeding.

### Step 6: Replace the uniform article rows with an editorial feed

Use a repeatable but varied composition:

```
Large horizontal story
Two compact stories side by side
Text-led story
Large horizontal story
Two compact stories side by side
```

The templates should remain data-driven and use the same article collection.

Each story may include:

- Cover or branded fallback
- Topic or series
- Date
- Reading time
- Title
- Short description

Rules:

- Do not manually duplicate article content in the homepage.
- Preserve chronological order after the curated lead stories.
- Do not use more than three layout variants.
- Use consistent typography, borders, and metadata to prevent visual noise.
- Stack every layout into one column on mobile.
- Continue showing all published articles until a dedicated archive is added later.

Checkpoint: confirm the homepage feels visually varied without becoming magazine-like or crowded.

### Step 7: Add the secondary homepage column

Add a 300–320px desktop sidebar beside the article feed.

#### Author card

- Temporary portrait
- Tanvir Aslam
- Senior frontend engineer and technical lead
- Two concise sentences
- About
- Résumé
- GitHub
- LinkedIn

#### Start here

Three manually curated cornerstone articles:

- Resilient Frontends, Part 1
- Resilient Frontends, Part 2
- One article representing AI or ad tech

This list should be explicitly configured rather than inferred from publication date.

#### Building now

Two compact project links:

- Pretend Terminal
- JSON Bourne
- `View all projects →`

These should be much smaller than the cards on `/projects`.

#### Browse by subject

- Frontend
- AI
- Ad Tech
- Leadership
- Include article counts

Do not add a newsletter block until there is an actual subscription provider and publishing plan.

Responsive behavior:

- Sidebar remains sticky on wide desktop.
- It becomes static below approximately 1000px.
- On mobile, the author card appears after the first three article stories.
- Start Here and Building Now follow the feed rather than appearing before the writing.

Checkpoint: verify that the author becomes discoverable without dominating the homepage.

### Step 8: Finish the interaction and accessibility layer

Verify:

- Full keyboard operation for the featured-story selector
- Visible focus indicators
- Semantic heading order
- No links nested inside links
- Search labels and live empty-state announcements
- Filter state exposed with `aria-pressed`
- Reduced-motion support
- No automatic carousel movement
- Touch targets of at least 44px on mobile
- Meaningful image alt text
- Homepage remains useful without JavaScript

### Step 9: Performance pass

- Eager-load only the initial featured cover.
- Lazy-load feed and sidebar images.
- Supply explicit image dimensions.
- Use responsive image sizes where appropriate.
- Keep generated fallback covers code-native.
- Avoid adding a carousel or UI dependency.
- Prevent layout movement while images load.
- Confirm the PWA precache contains the new brand assets and removes obsolete ones.

### Step 10: Final validation

Test at:

- 1440px desktop
- 1024px tablet/compact desktop
- 768px tablet
- 430px mobile
- 390px mobile

Validate:

- Light and dark themes
- Keyboard navigation
- Search and filtering
- Featured-story selection
- No-JavaScript rendering
- Offline rendering
- RSS and metadata
- Social sharing card
- `npm run check`
- `npm test`
- `git diff --check`

## Implementation checkpoints

To keep the redesign incremental:

1. Rebrand and new masthead
2. Featured/latest hero
3. Topic and search rail
4. Editorial feed
5. Author and discovery sidebar
6. Final responsive and accessibility pass

I recommend stopping for visual review after checkpoints 1, 2, and 5. Those are the moments where design direction matters most; the remaining work is primarily refinement and verification.
