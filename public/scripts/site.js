const root = document.documentElement;

function syncThemeButton() {
  const dark = root.dataset.theme === "dark";
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
  document.querySelector("iframe.giscus-frame")?.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, "https://giscus.app");
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

const homeGrid = document.querySelector("[data-home-grid]");
const rail = document.querySelector("[data-side-rail]");
const reopen = document.querySelector("[data-rail-reopen]");
let railTransitionTimer;
function setRail(open, animate = true) {
  clearTimeout(railTransitionTimer);
  rail?.removeAttribute("hidden");
  reopen?.removeAttribute("hidden");
  homeGrid?.classList.toggle("rail-closed", !open);
  rail?.setAttribute("aria-hidden", String(!open));
  reopen?.setAttribute("aria-hidden", String(open));
  document.querySelector("[data-rail-toggle]")?.setAttribute("aria-expanded", String(open));

  const finishTransition = () => {
    rail?.toggleAttribute("hidden", !open);
    reopen?.toggleAttribute("hidden", open);
  };
  if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    railTransitionTimer = setTimeout(finishTransition, 500);
  } else {
    finishTransition();
  }
  localStorage.setItem("aslam-rail", open ? "open" : "closed");
}
if (homeGrid) setRail(localStorage.getItem("aslam-rail") !== "closed", false);
document.querySelector("[data-rail-toggle]")?.addEventListener("click", () => setRail(false));
reopen?.addEventListener("click", () => setRail(true));

document.querySelector("[data-mobile-rail-toggle]")?.addEventListener("click", (event) => {
  const button = event.currentTarget;
  const content = document.querySelector("[data-mobile-rail]");
  const open = button.getAttribute("aria-expanded") !== "true";
  button.setAttribute("aria-expanded", String(open));
  content?.toggleAttribute("hidden", !open);
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

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
document.querySelector("[data-copy-link]")?.addEventListener("click", async (event) => {
  await navigator.clipboard.writeText(location.href);
  const button = event.currentTarget;
  button.dataset.tooltip = "Copied!";
  setTimeout(() => { button.dataset.tooltip = "Copy link"; }, 1400);
});

const progress = document.querySelector("[data-reading-progress]");
if (progress) addEventListener("scroll", () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.background = `linear-gradient(90deg,var(--teal) ${max ? scrollY / max * 100 : 0}%,var(--rule) 0)`;
}, { passive: true });

const giscus = document.querySelector("[data-giscus]");
if (giscus) {
  const script = document.createElement("script");
  Object.entries({ src: "https://giscus.app/client.js", "data-repo": "teemoto/aslambhai", "data-repo-id": "R_kgDOTde17Q", "data-category": "General", "data-category-id": "DIC_kwDOTde17c4DBig5", "data-mapping": "pathname", "data-strict": "0", "data-reactions-enabled": "1", "data-emit-metadata": "0", "data-input-position": "bottom", "data-theme": root.dataset.theme === "dark" ? "dark" : "light", "data-lang": "en", "data-loading": "lazy", crossorigin: "anonymous" }).forEach(([key, value]) => script.setAttribute(key, value));
  script.async = true;
  giscus.appendChild(script);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  }).catch(() => undefined);
}
