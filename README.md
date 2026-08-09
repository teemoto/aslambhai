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

## Deployment and domains

Every push to `main` deploys through GitHub Pages. In the repository's **Settings → Pages**, choose **GitHub Actions** as the publishing source, then configure `tanviraslam.com` as the custom domain and enable HTTPS after GitHub finishes provisioning the certificate.

At Porkbun, point `tanviraslam.com` to GitHub Pages with its four apex `A` records and point `www` to `teemoto.github.io` with a `CNAME` record. GitHub lists the current record values in its custom-domain instructions.

Use Porkbun URL forwarding to make `aslambh.ai` and `www.aslambh.ai` permanent (301) redirects to `https://tanviraslam.com`, with requested paths preserved. Remove the old website's conflicting DNS records before adding the new records or forward.
