import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "@/lib/types";

export type Section = "feed" | "trending" | "favorites";
export interface State {
  categories: string[];
  dark: boolean;
  favorites: Item[];
  section: Section;
  items: Item[];
  page: number;
  hasMore: boolean;
  status: "idle" | "loading" | "error";
  error?: string;
}
const initialState: State = {
  categories: ["technology", "sports", "finance"], dark: false, favorites: [],
  section: "feed", items: [], page: 1, hasMore: true, status: "idle",
};

function interleave(lists: Item[][]): Item[] {
  const out: Item[] = [];
  const max = Math.max(0, ...lists.map((l) => l.length));
  for (let i = 0; i < max; i++) lists.forEach((l) => l[i] && out.push(l[i]));
  return out;
}

export const fetchContent = createAsyncThunk(
  "app/fetchContent",
  async ({ reset, query }: { reset: boolean; query: string }, { getState }) => {
    const s = (getState() as { app: State }).app;
    const page = reset ? 1 : s.page + 1;
    const cats = s.section === "trending" ? ["general"] : s.categories;
    const parts = [...cats.map((c) => `type=news&category=${c}`), "type=movie&category=movies", "type=social&category=" + (cats[0] || "general")];
    const lists = await Promise.all(
      parts.map(async (x) => {
        const r = await fetch(`/api/content?${x}&q=${encodeURIComponent(query)}&page=${page}`);
        if (!r.ok) throw new Error("Could not load content. Check your connection and try again.");
        return (await r.json()) as Item[];
      })
    );
    return { items: interleave(lists), page };
  }
);

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    hydrate: (s, a: PayloadAction<Partial<Pick<State, "categories" | "dark" | "favorites">>>) => ({ ...s, ...a.payload }),
    setSection: (s, a: PayloadAction<Section>) => { s.section = a.payload; },
    toggleDark: (s) => { s.dark = !s.dark; },
    toggleCategory: (s, a: PayloadAction<string>) => {
      s.categories = s.categories.includes(a.payload) ? s.categories.filter((c) => c !== a.payload) : [...s.categories, a.payload];
    },
    toggleFavorite: (s, a: PayloadAction<Item>) => {
      s.favorites = s.favorites.some((f) => f.id === a.payload.id) ? s.favorites.filter((f) => f.id !== a.payload.id) : [a.payload, ...s.favorites];
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchContent.pending, (s) => { s.status = "loading"; s.error = undefined; });
    b.addCase(fetchContent.fulfilled, (s, a) => {
      const base = a.meta.arg.reset ? [] : s.items;
      const seen = new Set(base.map((i) => i.id));
      const fresh = a.payload.items.filter((i) => {
        if (seen.has(i.id)) return false;
        seen.add(i.id);
        return true;
      });
      s.items = [...base, ...fresh];
      s.page = a.payload.page;
      s.hasMore = a.payload.items.length > 0 && a.payload.page < 5;
      s.status = "idle";
    });
    b.addCase(fetchContent.rejected, (s, a) => { s.status = "error"; s.error = a.error.message; });
  },
});
export const { hydrate, setSection, toggleDark, toggleCategory, toggleFavorite } = slice.actions;
export default slice.reducer;
