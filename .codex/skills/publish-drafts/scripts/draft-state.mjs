#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";

const root = process.cwd();
const draftsDirectory = resolve(root, "src/content/drafts");
const articlesDirectory = resolve(root, "src/content/articles");
const ledgerPath = resolve(root, ".codex/state/draft-publication.json");

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

function repoPath(path) {
  return relative(root, path).split(sep).join("/");
}

function resolveInside(base, input, label) {
  const absolute = resolve(root, input);
  const rel = relative(base, absolute);
  if (rel === "" || rel.startsWith(`..${sep}`) || rel === ".." || rel.includes(`${sep}..${sep}`)) {
    fail(`${label} must be inside ${repoPath(base)}: ${input}`);
  }
  return absolute;
}

function hashFile(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function readLedger() {
  if (!existsSync(ledgerPath)) fail(`Draft ledger is missing: ${repoPath(ledgerPath)}`);

  try {
    const ledger = JSON.parse(readFileSync(ledgerPath, "utf8"));
    if (ledger.version !== 1 || typeof ledger.drafts !== "object" || ledger.drafts === null) {
      fail(`Draft ledger has an unsupported structure: ${repoPath(ledgerPath)}`);
    }
    return ledger;
  } catch (error) {
    fail(`Could not read draft ledger: ${error.message}`);
  }
}

function draftFiles() {
  if (!existsSync(draftsDirectory)) fail(`Draft directory is missing: ${repoPath(draftsDirectory)}`);
  return readdirSync(draftsDirectory, { recursive: true })
    .map((entry) => resolve(draftsDirectory, entry))
    .filter((path) => statSync(path).isFile() && /\.mdx?$/i.test(path))
    .sort((a, b) => a.localeCompare(b));
}

function valuesFor(args, flag) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag) {
      if (!args[index + 1] || args[index + 1].startsWith("--")) fail(`${flag} requires a value`);
      values.push(args[index + 1]);
      index += 1;
    }
  }
  return values;
}

function classify(path, ledger) {
  const key = repoPath(path);
  const hash = hashFile(path);
  const recorded = ledger.drafts[key];
  return {
    file: key,
    status: !recorded ? "new" : recorded.hash === hash ? "unchanged" : "changed",
    hash,
    recorded: recorded ?? null,
  };
}

async function scan(args) {
  const ledger = readLedger();
  const requested = valuesFor(args, "--file");
  const files = requested.length > 0
    ? requested.map((input) => resolveInside(draftsDirectory, input, "Draft"))
    : draftFiles();

  for (const file of files) {
    if (!existsSync(file) || !statSync(file).isFile()) fail(`Draft does not exist: ${repoPath(file)}`);
    if (!/\.mdx?$/i.test(file)) fail(`Draft must be Markdown or MDX: ${repoPath(file)}`);
  }

  const results = files.map((file) => classify(file, ledger));
  const selected = requested.length > 0 ? results : results.filter(({ status }) => status === "new");
  process.stdout.write(`${JSON.stringify({ selected, all: results }, null, 2)}\n`);
}

async function record(args) {
  const draftInput = valuesFor(args, "--file");
  const articleInput = valuesFor(args, "--article");
  if (draftInput.length !== 1 || articleInput.length !== 1) {
    fail("record requires exactly one --file and one --article");
  }

  const draft = resolveInside(draftsDirectory, draftInput[0], "Draft");
  const article = resolveInside(articlesDirectory, articleInput[0], "Article");
  if (!existsSync(draft) || !statSync(draft).isFile()) fail(`Draft does not exist: ${repoPath(draft)}`);
  if (!existsSync(article) || !statSync(article).isFile()) fail(`Article does not exist: ${repoPath(article)}`);

  const ledger = readLedger();
  ledger.drafts[repoPath(draft)] = {
    hash: hashFile(draft),
    article: repoPath(article),
    processedAt: new Date().toISOString().slice(0, 10),
  };

  ledger.drafts = Object.fromEntries(Object.entries(ledger.drafts).sort(([a], [b]) => a.localeCompare(b)));
  await mkdir(dirname(ledgerPath), { recursive: true });
  writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`);
  process.stdout.write(`Recorded ${repoPath(draft)} -> ${repoPath(article)}\n`);
}

const [, , command, ...args] = process.argv;
if (command === "scan") await scan(args);
else if (command === "record") await record(args);
else fail("Usage: draft-state.mjs <scan|record> [--file <draft>] [--article <article>]");
