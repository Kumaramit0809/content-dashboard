import { NextResponse } from "next/server";
import { mock } from "@/lib/mock";
import { Item } from "@/lib/types";

// Server-side proxy: API keys never reach the browser.
export async function GET(req: Request) {
  const p = new URL(req.url).searchParams;
  const type = (p.get("type") || "news") as Item["type"];
  const category = p.get("category") || "technology";
  const q = p.get("q") || "";
  const page = Math.max(1, Number(p.get("page") || 1));
  try {
    if (type === "news" && process.env.NEWS_API_KEY) {
      const url = q
        ? `https://newsapi.org/v2/everything?q=${encodeURIComponent(q)}&page=${page}&pageSize=10`
        : `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(category)}&page=${page}&pageSize=10&language=en`;
      const r = await fetch(url, { headers: { "X-Api-Key": process.env.NEWS_API_KEY } });
      if (!r.ok) throw new Error("News API error");
      const j = await r.json();
      const items: Item[] = (j.articles || []).map((a: any) => ({
        id: `n-${a.url}`, type: "news", title: a.title, description: a.description || "",
        image: a.urlToImage || undefined, url: a.url, category,
      }));
      return NextResponse.json(items);
    }
    if (type === "movie" && process.env.TMDB_API_KEY) {
      const url = q
        ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&page=${page}`
        : `https://api.themoviedb.org/3/trending/movie/week?page=${page}`;
      const r = await fetch(url, { headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` } });
      if (!r.ok) throw new Error("TMDB error");
      const j = await r.json();
      const items: Item[] = (j.results || []).map((m: any) => ({
        id: `m-${m.id}`, type: "movie", title: m.title, description: m.overview || "",
        image: m.poster_path ? `https://image.tmdb.org/t/p/w300${m.poster_path}` : undefined,
        url: `https://www.themoviedb.org/movie/${m.id}`, category: "movies",
      }));
      return NextResponse.json(items);
    }
    return NextResponse.json(mock(type, category, q, page));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 502 });
  }
}
