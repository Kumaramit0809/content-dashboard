import { Item } from "./types";
/** Sample data used when no API key is configured (and for the social feed). */
export function mock(type: Item["type"], category: string, q: string, page: number): Item[] {
  if (page > 5) return [];
  return Array.from({ length: 5 }, (_, i) => {
    const n = (page - 1) * 5 + i + 1;
    const topic = q || category;
    return {
      id: `${type}-${category}-${q}-${n}`,
      type,
      category: type === "movie" ? "movies" : category,
      title: type === "social" ? `@creator${n}: thoughts on #${topic}` : `${topic} ${type === "movie" ? "film" : "story"} #${n}`,
      description: "Sample content shown because no API key is configured. Add keys in .env.local for live data.",
      image: `https://picsum.photos/seed/${type}${category}${n}/300/200`,
      url: "https://example.com",
    };
  });
}
