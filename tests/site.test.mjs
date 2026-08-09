import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

test("builds the key static routes", async () => {
  for (const file of ["index.html", "projects/index.html", "about/index.html", "articles/resilient-frontend-architecture/index.html", "rss.xml", "sitemap-index.xml"]) {
    await access(new URL(`../dist/${file}`, import.meta.url));
  }
});

test("renders metadata and article content", async () => {
  const home = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const article = await readFile(new URL("../dist/articles/resilient-frontend-architecture/index.html", import.meta.url), "utf8");
  assert.match(home, /name="codex-preview" content="development"/);
  assert.match(home, /class="logo-mark"/);
  assert.match(home, /property="og:image"/);
  assert.match(home, /Engineering at scale/);
  assert.match(article, /Join the discussion/);
  assert.match(article, /giscus-container/);
});

test("keeps article metadata aligned with accessible actions and generated contents", async () => {
  const article = await readFile(new URL("../dist/articles/resilient-frontend-architecture/index.html", import.meta.url), "utf8");
  const stylesheet = article.match(/href="([^"]+\.css)"/)?.[1];
  assert.ok(stylesheet, "Expected a generated stylesheet");
  const styles = await readFile(new URL(`../dist${stylesheet}`, import.meta.url), "utf8");
  const script = await readFile(new URL("../dist/scripts/site.js", import.meta.url), "utf8");

  assert.equal((article.match(/class="byline-meta"/g) ?? []).length, 2);
  assert.match(article, /class="byline-meta"[^>]*>.*10 min read<\/span>/s);
  assert.match(article, /class="byline-meta"[^>]*>.*August 3, 2026<\/span>/s);
  assert.match(styles, /\.article-byline>\.byline-meta\{display:inline-flex;align-items:center;gap:8px/);
  assert.match(article, /class="article-reading-area"/);
  assert.match(article, /class="share-tools" aria-label="Article actions"/);
  assert.match(article, /Copy link/);
  assert.match(article, /Author on GitHub/);
  assert.match(article, /class="article-toc" open/);
  assert.match(article, /href="#two-bridges"/);
  assert.match(styles, /\.share-tools\{position:sticky;top:130px/);
  assert.match(styles, /\.article-toc\{width:min\(100%,820px\)/);
  assert.match(styles, /\.article-reading-area\{width:min\(100%,900px\)/);
  assert.match(script, /label\.textContent\s*=\s*"Copied"/);
});

test("keeps the side-panel reopen control hidden while the panel is expanded", async () => {
  const home = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const stylesheet = home.match(/href="([^"]+\.css)"/)?.[1];
  assert.ok(stylesheet, "Expected a generated stylesheet");
  const styles = await readFile(new URL(`../dist${stylesheet}`, import.meta.url), "utf8");

  assert.match(home, /data-rail-reopen[^>]*hidden/);
  assert.match(styles, /\[hidden\]\{display:none!important\}/);
});

test("animates the desktop side panel over half a second", async () => {
  const home = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const stylesheet = home.match(/href="([^"]+\.css)"/)?.[1];
  assert.ok(stylesheet, "Expected a generated stylesheet");
  const styles = await readFile(new URL(`../dist${stylesheet}`, import.meta.url), "utf8");
  const script = await readFile(new URL("../dist/scripts/site.js", import.meta.url), "utf8");

  assert.match(styles, /transition:grid-template-columns \.5s ease/);
  assert.match(styles, /\.home-grid\.rail-closed\{grid-template-columns:minmax\(0,1fr\) minmax\(0,0fr\)\}/);
  assert.match(script, /setTimeout\(finishTransition, 500\)/);
});

test("uses an unobstructed minimalist side-panel control", async () => {
  const home = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const stylesheet = home.match(/href="([^"]+\.css)"/)?.[1];
  assert.ok(stylesheet, "Expected a generated stylesheet");
  const styles = await readFile(new URL(`../dist${stylesheet}`, import.meta.url), "utf8");

  assert.match(home, /aria-label="Collapse side panel"[^>]*>.*m9 18 6-6-6-6/s);
  assert.match(styles, /\.rail-toggle\{[^}]*left:12px[^}]*width:32px[^}]*border:0/);
  assert.doesNotMatch(home, /panelClose|panelOpen/);
});

test("renders the personal footer message", async () => {
  const home = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(home, /Built with ❤️ and ☕/);
  assert.doesNotMatch(home, /Built in public through Anabasis/);
});

test("publishes the complete logo identity", async () => {
  for (const file of ["brand/aslam-bhai-mark.png", "brand/social-card.png", "apple-touch-icon.png", "icon-192.png", "icon-512.png"]) {
    assert.ok((await stat(new URL(`../dist/${file}`, import.meta.url))).size > 1_000);
  }
});

test("publishes the downloadable résumé", async () => {
  const resume = new URL("../dist/resume/tanvir-aslam-mohammed-resume.pdf", import.meta.url);
  assert.ok((await stat(resume)).size > 100_000);
  const about = await readFile(new URL("../dist/about/index.html", import.meta.url), "utf8");
  assert.match(about, /tanvir-aslam-mohammed-resume\.pdf/);
});

test("keeps the launch surface honest", async () => {
  const home = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const projects = await readFile(new URL("../dist/projects/index.html", import.meta.url), "utf8");
  const script = await readFile(new URL("../dist/scripts/site.js", import.meta.url), "utf8");

  assert.doesNotMatch(home, /data-static-form|sort-button/);
  assert.doesNotMatch(home, /dispatch|subscribe|subscription/i);
  assert.doesNotMatch(projects, /href="#"/);
  assert.match(projects, /Usable alpha/);
  assert.match(script, /getRegistrations/);
  await assert.rejects(access(new URL("../dist/sw.js", import.meta.url)));
});

test("publishes only complete articles", async () => {
  const articles = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  assert.match(articles, /resilient-frontend-architecture/);
  assert.doesNotMatch(articles, /Component Boundaries and the Cost of Change|Modern Advertising Stack|RAG, Tooling/);
});

test("formats article dates consistently in UTC", async () => {
  const home = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  const article = await readFile(new URL("../dist/articles/resilient-frontend-architecture/index.html", import.meta.url), "utf8");
  assert.match(home, /Aug 3, 2026/);
  assert.match(article, /August 3, 2026/);
});
