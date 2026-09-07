import { getCategoryIcon, getCategoryTintClass } from "@/lib/blog-category-icon";

export default function BlogThumbnail({
  category,
  className = "h-24",
}: {
  category: string | null;
  className?: string;
}) {
  const Icon = getCategoryIcon(category);

  return (
    <div className={`relative w-full overflow-hidden bg-linear-to-br from-dark to-brand-dark ${className}`}>
      <div className={`absolute inset-0 ${getCategoryTintClass(category)}`} />
      <Icon
        className="absolute -right-3 top-1/2 h-[220%] w-auto -translate-y-1/2 text-white/15"
        strokeWidth={1}
      />
      {category && (
        <span className="absolute left-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 text-xs font-semibold text-white">
          <Icon className="h-3.5 w-3.5" />
          {category}
        </span>
      )}
    </div>
  );
}
