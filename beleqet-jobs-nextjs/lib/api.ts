const API_BASE =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1"
    : "/api/v1";

export type ApiJob = {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  location: string;
  type: string;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  featured: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  companyName?: string;
  companyLogo?: string;
  experienceLevel?: string;
  company: {
    id: string;
    name: string;
    logoUrl?: string;
    website?: string;
  };
  category: {
    id: string;
    slug: string;
    label: string;
    icon?: string;
  };
  _count?: { applications: number };
};

export type ApiCategory = {
  id: string;
  slug: string;
  label: string;
  icon?: string;
};

export type PaginatedJobs = {
  items: ApiJob[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type JobsQuery = {
  q?: string;
  category?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
};

export async function fetchJobs(params?: JobsQuery): Promise<PaginatedJobs> {
  const qs = new URLSearchParams();
  if (params?.q) qs.set("q", params.q);
  if (params?.category) qs.set("category", params.category);
  if (params?.location) qs.set("location", params.location);
  if (params?.type) qs.set("type", params.type);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));

  const res = await fetch(`${API_BASE}/jobs?${qs.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Jobs fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchJob(id: string): Promise<ApiJob> {
  const res = await fetch(`${API_BASE}/jobs/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Job fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  const res = await fetch(`${API_BASE}/jobs/categories`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Categories fetch failed: ${res.status}`);
  return res.json();
}

// FULL_TIME -> Full Time, PART_TIME -> Part Time, etc.
const typeLabels: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  CONTRACT: "Contract",
};

export function formatJobType(raw: string): string {
  return typeLabels[raw] || raw;
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
