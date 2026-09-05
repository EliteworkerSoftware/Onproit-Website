import { getCategoryIcon } from "@/lib/blog-category-icon";

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
      <Icon
        className="absolute -right-6 -top-6 h-[130%] w-auto text-white/10"
        strokeWidth={1}
      />
    </div>
  );
}
