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

const search = document.querySelector("[data-search-input]");
const chips = [...document.querySelectorAll("[data-topic]")];
let selectedTopic = "All";
function filterArticles() {
  const query = search?.value.trim().toLowerCase() ?? "";
  let visible = 0;
  document.querySelectorAll("[data-article]").forEach((article) => {
    const topic = article.dataset.topicValue ?? article.dataset.search ?? "";
    const topicMatch = selectedTopic === "All" || topic.includes(selectedTopic);
    const textMatch = (article.dataset.search ?? "").includes(query);
    article.toggleAttribute("hidden", !(topicMatch && textMatch));
    if (topicMatch && textMatch) visible += 1;
  });
  document.querySelector("[data-empty-state]")?.toggleAttribute("hidden", visible > 0);
}
search?.addEventListener("input", filterArticles);
chips.forEach((chip) => chip.addEventListener("click", () => {
  selectedTopic = chip.dataset.topic;
  chips.forEach((item) => item.classList.toggle("selected", item === chip));
  filterArticles();
}));

const editorialLead = document.querySelector("[data-editorial-lead]");
if (editorialLead) {
  const leadPanels = [...editorialLead.querySelectorAll("[data-lead-panel]")];
  const leadTriggers = [...editorialLead.querySelectorAll("[data-lead-trigger]")];
  const leadStatus = editorialLead.querySelector("[data-lead-status]");

  leadTriggers.forEach((trigger) => trigger.addEventListener("click", () => {
    const selectedPanel = leadPanels.find((panel) => panel.dataset.leadPanel === trigger.dataset.leadTrigger);
    if (!selectedPanel) return;

    leadPanels.forEach((panel) => panel.toggleAttribute("hidden", panel !== selectedPanel));
    leadTriggers.forEach((item) => item.setAttribute("aria-pressed", String(item === trigger)));
    editorialLead.dataset.search = selectedPanel.dataset.leadSearch;
    editorialLead.dataset.topicValue = selectedPanel.dataset.leadTopic;
    if (leadStatus) leadStatus.textContent = `Showing ${selectedPanel.querySelector("h1")?.textContent ?? "selected article"}`;
    filterArticles();
  }));
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
