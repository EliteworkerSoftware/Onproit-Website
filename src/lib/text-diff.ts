// Turns code diffs and before/after text into plain lines an admin can read:
// what was removed, what was added, and which words changed within a line.

export type DiffLine = { type: "add" | "del"; text: string; changed?: [number, number][] };
export interface DiffGroup {
  label: string;
  lines: DiffLine[];
}

// Longest-common-subsequence alignment of two token lists.
function lcsOps<T>(a: T[], b: T[]): ("same" | "del" | "add")[] {
  const n = a.length;
  const m = b.length;
  const table: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    }
  }
  const ops: ("same" | "del" | "add")[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      ops.push("same");
      i++;
      j++;
    } else if (table[i + 1][j] >= table[i][j + 1]) {
      ops.push("del");
      i++;
    } else {
      ops.push("add");
      j++;
    }
  }
  while (i++ < n) ops.push("del");
  while (j++ < m) ops.push("add");
  return ops;
}

// Character ranges of the words that differ between two versions of a line.
function wordChanges(before: string, after: string): { del: [number, number][]; add: [number, number][] } {
  const tokenize = (s: string) => s.match(/\s+|[^\s]+/g) ?? [];
  const a = tokenize(before);
  const b = tokenize(after);
  if (a.length * b.length > 250_000) return { del: [[0, before.length]], add: [[0, after.length]] };
  const del: [number, number][] = [];
  const add: [number, number][] = [];
  let ai = 0;
  let bi = 0;
  let ap = 0;
  let bp = 0;
  for (const op of lcsOps(a, b)) {
    if (op === "same") {
      ap += a[ai++].length;
      bp += b[bi++].length;
    } else if (op === "del") {
      del.push([ap, ap + a[ai].length]);
      ap += a[ai++].length;
    } else {
      add.push([bp, bp + b[bi].length]);
      bp += b[bi++].length;
    }
  }
  return { del, add };
}

// Pairs each run of removed lines with the added lines that replaced it and
// marks the changed words, so a one-word edit in a long sentence stands out.
function markWordChanges(lines: DiffLine[]): DiffLine[] {
  const out: DiffLine[] = [];
  let i = 0;
  while (i < lines.length) {
    const dels: DiffLine[] = [];
    const adds: DiffLine[] = [];
    while (i < lines.length && lines[i].type === "del") dels.push(lines[i++]);
    while (i < lines.length && lines[i].type === "add") adds.push(lines[i++]);
    if (!dels.length && !adds.length) {
      out.push(lines[i++]);
      continue;
    }
    for (let k = 0; k < Math.min(dels.length, adds.length); k++) {
      const { del, add } = wordChanges(dels[k].text, adds[k].text);
      dels[k] = { ...dels[k], changed: del };
      adds[k] = { ...adds[k], changed: add };
    }
    out.push(...dels, ...adds);
  }
  return out;
}

// A line of site data or page code, reduced to the words a visitor would see:
// no indentation, field names, quotes, or trailing commas. Lines that are
// only syntax come back empty.
function readable(line: string): string {
  return line
    .trim()
    .replace(/^[A-Za-z_]\w*\??:\s*/, "")
    .replace(/^["'`]|["'`],?$/g, "")
    .replace(/,$/, "")
    .replace(/\\"/g, '"')
    .replace(/^[{}[\]()]+;?$/, "")
    .trim();
}

// One file's unified diff (GitHub's `patch`) → readable removed/added lines.
export function linesFromPatch(patch: string | undefined): DiffLine[] {
  if (!patch) return [];
  const lines: DiffLine[] = [];
  for (const raw of patch.split("\n")) {
    if (raw.startsWith("+++") || raw.startsWith("---") || raw.startsWith("@@")) continue;
    const sign = raw[0];
    if (sign !== "+" && sign !== "-") continue;
    const text = readable(raw.slice(1));
    if (text) lines.push({ type: sign === "+" ? "add" : "del", text });
  }
  return markWordChanges(lines);
}

// HTML (a blog post) → its text, one entry per paragraph/heading/list item.
export function htmlBlocks(html: string): string[] {
  return html
    .replace(/<\/(p|h[1-6]|li|blockquote|tr)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;|&lsquo;/g, "'")
    .replace(/&rdquo;|&ldquo;/g, '"')
    .replace(/&mdash;/g, "—")
    .split("\n")
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

// Before/after text blocks → just the removed and added ones.
export function linesFromBlocks(before: string[], after: string[]): DiffLine[] {
  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  for (const op of lcsOps(before, after)) {
    if (op === "same") {
      i++;
      j++;
    } else if (op === "del") lines.push({ type: "del", text: before[i++] });
    else lines.push({ type: "add", text: after[j++] });
  }
  return markWordChanges(lines);
}
