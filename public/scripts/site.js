const root = document.documentElement;
const darkThemes = new Set((root.dataset.darkThemes ?? "dark").split(","));

function isDarkTheme(theme) {
  return darkThemes.has(theme);
}

function syncThemeButton() {
  const dark = isDarkTheme(root.dataset.theme);
  document.querySelector('[data-theme-icon="moon"]')?.toggleAttribute("hidden", dark);
  document.querySelector('[data-theme-icon="sun"]')?.toggleAttribute("hidden", !dark);
  const button = document.querySelector("[data-theme-toggle]");
  button?.setAttribute("aria-label", dark ? "Use light theme" : "Use dark theme");
}

syncThemeButton();
document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = theme;
  localStorage.setItem("aslam-theme", theme);
  syncThemeButton();
  document.querySelector("iframe.giscus-frame")?.contentWindow?.postMessage({ giscus: { setConfig: { theme: isDarkTheme(theme) ? "dark" : "light" } } }, "https://giscus.app");
});

document.querySelector("[data-menu-toggle]")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  const open = button.getAttribute("aria-expanded") !== "true";
  button.setAttribute("aria-expanded", String(open));
  button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.querySelector("#main-nav")?.classList.toggle("open", open);
  document.querySelector('[data-menu-icon="open"]')?.toggleAttribute("hidden", open);
  document.querySelector('[data-menu-icon="close"]')?.toggleAttribute("hidden", !open);
});

const scrollRails = [...document.querySelectorAll("[data-scroll-rail]")];
function syncScrollRail(rail) {
  const viewport = rail.querySelector("[data-scroll-viewport]");
  if (!viewport) return;
  const endPadding = Number.parseFloat(getComputedStyle(viewport).paddingRight) || 0;
  const hasMore = viewport.scrollWidth - viewport.scrollLeft - viewport.clientWidth > endPadding + 2;
  rail.toggleAttribute("data-scroll-more", hasMore);
}
scrollRails.forEach((rail) => {
  const viewport = rail.querySelector("[data-scroll-viewport]");
  syncScrollRail(rail);
  viewport?.addEventListener("scroll", () => syncScrollRail(rail), { passive: true });
});
addEventListener("resize", () => scrollRails.forEach(syncScrollRail), { passive: true });
document.fonts?.ready.then(() => scrollRails.forEach(syncScrollRail));

const search = document.querySelector("[data-search-input]");
const chips = [...document.querySelectorAll("[data-topic]")];
const filterResults = document.querySelector("[data-filter-results]");
const feedEyebrow = document.querySelector("[data-feed-eyebrow]");
const feedHeading = document.querySelector("[data-feed-heading]");
const feedViewButtons = [...document.querySelectorAll("[data-feed-view]")];
let selectedTopic = "All";
function setFeedView(view) {
  if (!filterResults) return;
  filterResults.dataset.view = view;
  feedViewButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.feedView === view)));
  localStorage.setItem("home-feed-view", view);
}
const savedFeedView = localStorage.getItem("home-feed-view");
setFeedView(savedFeedView === "rows" ? "rows" : "blocks");
feedViewButtons.forEach((button) => button.addEventListener("click", () => setFeedView(button.dataset.feedView)));
function filterArticles() {
  const query = search?.value.trim().toLowerCase() ?? "";
  const hasActiveFilter = selectedTopic !== "All" || query.length > 0;
  let visible = 0;
  filterResults?.toggleAttribute("data-filter-active", hasActiveFilter);
  filterResults?.querySelectorAll("[data-article]").forEach((article) => {
    const topic = article.dataset.topicValue ?? article.dataset.search ?? "";
    const topicMatch = selectedTopic === "All" || topic.includes(selectedTopic);
    const textMatch = (article.dataset.search ?? "").includes(query);
    const curatedStory = article.hasAttribute("data-curated-story");
    const matches = topicMatch && textMatch && (hasActiveFilter || !curatedStory);
    article.toggleAttribute("hidden", !matches);
    if (matches) visible += 1;
  });
  if (feedEyebrow) feedEyebrow.textContent = hasActiveFilter ? "Filtered writing" : "From the archive";
  if (feedHeading) feedHeading.textContent = hasActiveFilter ? `${visible} ${visible === 1 ? "result" : "results"}` : "More writing";
  document.querySelector("[data-empty-state]")?.toggleAttribute("hidden", visible > 0);
}
search?.addEventListener("input", filterArticles);
chips.forEach((chip) => chip.addEventListener("click", () => {
  selectedTopic = chip.dataset.topic;
  chips.forEach((item) => item.classList.toggle("selected", item === chip));
  chips.forEach((item) => item.setAttribute("aria-pressed", String(item === chip)));
  filterArticles();
}));

const editorialLead = document.querySelector("[data-editorial-lead]");
if (editorialLead) {
  const leadPanels = [...editorialLead.querySelectorAll("[data-lead-panel]")];
  const leadTriggers = [...editorialLead.querySelectorAll("[data-lead-trigger]")];
  const featuredPanel = leadPanels[0];
  const featuredTrigger = editorialLead.querySelector("[data-featured-trigger]");
  const leadStatus = editorialLead.querySelector("[data-lead-status]");

  const selectLeadPanel = (selectedPanel, activeTrigger) => {
    leadPanels.forEach((panel) => panel.toggleAttribute("hidden", panel !== selectedPanel));
    leadTriggers.forEach((item) => item.setAttribute("aria-pressed", String(item === activeTrigger)));
    featuredTrigger?.toggleAttribute("hidden", selectedPanel === featuredPanel);
    if (leadStatus) leadStatus.textContent = `Showing ${selectedPanel.querySelector("h1")?.textContent ?? "selected article"}`;
  };

  leadTriggers.forEach((trigger) => trigger.addEventListener("click", () => {
    const selectedPanel = leadPanels.find((panel) => panel.dataset.leadPanel === trigger.dataset.leadTrigger);
    if (!selectedPanel) return;
    selectLeadPanel(selectedPanel, trigger);
  }));

  featuredTrigger?.addEventListener("click", () => {
    if (featuredPanel) selectLeadPanel(featuredPanel, null);
  });
}

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
document.querySelector("[data-copy-link]")?.addEventListener("click", async (event) => {
  await navigator.clipboard.writeText(location.href);
  const button = event.currentTarget;
  const label = button.querySelector("[data-copy-link-label]");
  label.textContent = "Copied";
  button.dataset.tooltip = "Copied!";
  button.setAttribute("aria-label", "Article link copied");
  setTimeout(() => {
    label.textContent = "Copy link";
    button.dataset.tooltip = "Copy link";
    button.setAttribute("aria-label", "Copy article link");
  }, 1400);
});

const progress = document.querySelector("[data-reading-progress]");
if (progress) addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.background = `linear-gradient(90deg,var(--teal) ${max ? scrollY / max * 100 : 0}%,var(--rule) 0)`;
}, { passive: true });

const giscus = document.querySelector("[data-giscus]");
if (giscus) {
  const script = document.createElement("script");
  Object.entries({ src: "https://giscus.app/client.js", "data-repo": "teemoto/aslambhai", "data-repo-id": "R_kgDOTde17Q", "data-category": "General", "data-category-id": "DIC_kwDOTde17c4DBig5", "data-mapping": "pathname", "data-strict": "0", "data-reactions-enabled": "1", "data-emit-metadata": "0", "data-input-position": "bottom", "data-theme": isDarkTheme(root.dataset.theme) ? "dark" : "light", "data-lang": "en", "data-loading": "lazy", crossorigin: "anonymous" }).forEach(([key, value]) => script.setAttribute(key, value));
  script.async = true;
  giscus.appendChild(script);
}
