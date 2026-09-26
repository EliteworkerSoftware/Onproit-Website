import type { DiffGroup, DiffLine } from "@/lib/text-diff";

// Highlights the changed words within a line.
function Marked({ line }: { line: DiffLine }) {
  if (!line.changed?.length) return <>{line.text}</>;
  const parts: React.ReactNode[] = [];
  let at = 0;
  line.changed.forEach(([start, end], i) => {
    if (start > at) parts.push(line.text.slice(at, start));
    parts.push(
      <mark
        key={i}
        className={line.type === "del" ? "rounded bg-red-200 text-red-900 line-through" : "rounded bg-green-200 text-green-900"}
      >
        {line.text.slice(start, end)}
      </mark>
    );
    at = end;
  });
  if (at < line.text.length) parts.push(line.text.slice(at));
  return <>{parts}</>;
}

// Before/after text: red lines were removed, green lines were added.
export default function ChangesView({ groups }: { groups: DiffGroup[] }) {
  if (!groups.length) return <p className="text-sm text-gray-500">No text changes.</p>;
  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        <span className="rounded bg-red-50 px-1 text-red-700">Red</span> was removed,{" "}
        <span className="rounded bg-green-50 px-1 text-green-700">green</span> was added. Highlighted words are what changed within
        a sentence.
      </p>
      {groups.map((g) => (
        <div key={g.label}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{g.label}</p>
          <ul className="mt-1 space-y-1">
            {g.lines.map((line, i) => (
              <li
                key={i}
                className={`rounded-md border-l-4 px-3 py-1.5 text-sm ${
                  line.type === "del" ? "border-red-400 bg-red-50 text-red-800" : "border-green-500 bg-green-50 text-green-900"
                }`}
              >
                <span className="mr-1.5 font-semibold">{line.type === "del" ? "−" : "+"}</span>
                <Marked line={line} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
