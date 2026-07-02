import Link from "next/link";
import {
  Laptop,
  Megaphone,
  Landmark,
  HeartPulse,
  GraduationCap,
  Cog,
  MoreHorizontal,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import { fetchCategories } from "@/lib/api";

const iconMap: Record<string, LucideIcon> = {
  laptop: Laptop,
  megaphone: Megaphone,
  landmark: Landmark,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  cog: Cog,
  "more-horizontal": MoreHorizontal,
  briefcase: Briefcase,
};

export default async function CategoryGrid() {
  const categories = await fetchCategories();

  if (categories.length === 0) return null;

  // Ensure categories that contain our demo jobs appear in the first 21
  const prioritizedSlugs = ['software-design-and-development', 'marketing-and-advertisement'];
  const sortedCategories = [...categories].sort((a, b) => {
    if (prioritizedSlugs.includes(a.slug) && !prioritizedSlugs.includes(b.slug)) return -1;
    if (!prioritizedSlugs.includes(a.slug) && prioritizedSlugs.includes(b.slug)) return 1;
    return 0;
  });

  return (
    <section className="container-page py-14">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-sectionH2">Browse Jobs by Category</h2>
          <p className="text-muted text-sm mt-1">Explore opportunities across growing industries and find jobs that match your skills.</p>
        </div>
        <Link href="/jobs" className="hidden sm:inline-block text-sm font-semibold text-brandGreen hover:underline shrink-0">
          View all categories →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {sortedCategories.slice(0, 21).map((cat) => {
          const Icon = (cat.icon && iconMap[cat.icon]) || MoreHorizontal;
          return (
            <Link
              key={cat.id}
              href={`/jobs?category=${cat.slug}`}
              className="flex flex-col items-center text-center gap-2 rounded-xl border border-border bg-white px-3 py-5 hover:border-brandGreen hover:shadow-card transition-all"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-brandGreen/10 text-brandGreen">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-xs font-semibold text-ink">{cat.label}</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
