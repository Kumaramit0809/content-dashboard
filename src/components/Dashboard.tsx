"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Reorder, motion } from "framer-motion";
import Card from "./Card";
import { Item } from "@/lib/types";
import { useDebounce } from "@/lib/useDebounce";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContent, Section, setSection, toggleCategory, toggleDark, toggleFavorite } from "@/store/slice";

const CATS = ["technology", "sports", "finance", "health", "science", "entertainment"];
const NAV: { id: Section; label: string }[] = [
  { id: "feed", label: "My feed" },
  { id: "trending", label: "Trending" },
  { id: "favorites", label: "Favorites" },
];

const headerBtn =
  "cursor-pointer select-none rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]";

function Feed({
  items,
  favIds,
  onFav,
  onMore,
  canMore,
}: {
  items: Item[];
  favIds: Set<string>;
  onFav: (i: Item) => void;
  onMore: () => void;
  canMore: boolean;
}) {
  const [list, setList] = useState(items);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => setList(items), [items]);

  useEffect(() => {
    const el = end.current;
    if (!el || !canMore || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) onMore();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [canMore, onMore, list.length]);

  return (
    <>
      <Reorder.Group axis="y" values={list} onReorder={setList} className="space-y-3" aria-label="Content cards, drag to reorder">
        {list.map((item) => (
          <Reorder.Item key={item.id} value={item} className="cursor-grab active:cursor-grabbing" whileDrag={{ scale: 1.02 }}>
            <Card item={item} fav={favIds.has(item.id)} onFav={() => onFav(item)} />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <div ref={end} className="h-6" />
    </>
  );
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((x) => x.app);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [acct, setAcct] = useState(false);
  const q = useDebounce(text, 400);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.dark);
  }, [state.dark]);

  useEffect(() => {
    if (state.section !== "favorites") dispatch(fetchContent({ reset: true, query: q }));
  }, [q, state.section, state.categories, dispatch]);

  const loadMore = useCallback(() => {
    if (state.status !== "loading" && state.hasMore) dispatch(fetchContent({ reset: false, query: q }));
  }, [state.status, state.hasMore, q, dispatch]);

  const isFav = state.section === "favorites";
  const items = useMemo(
    () => (isFav ? state.favorites.filter((f) => f.title.toLowerCase().includes(q.toLowerCase())) : state.items),
    [isFav, state.favorites, state.items, q]
  );
  const favIds = useMemo(() => new Set(state.favorites.map((f) => f.id)), [state.favorites]);
  const title = NAV.find((n) => n.id === state.section)?.label ?? "My feed";

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <nav aria-label="Sections" className="flex gap-2 border-b border-[var(--border)] p-3 md:w-52 md:flex-col md:border-b-0 md:border-r md:p-5">
        <h1 className="hidden md:mb-4 md:block">
          <button
            type="button"
            onClick={() => {
              dispatch(setSection("feed"));
              setText("");
            }}
            className="cursor-pointer select-none text-lg font-bold transition hover:text-[var(--accent)]"
          >
            Dashboard
          </button>
        </h1>
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => dispatch(setSection(n.id))}
            aria-current={state.section === n.id ? "page" : undefined}
            className={`cursor-pointer rounded-md px-3 py-2 text-left text-sm ${
              state.section === n.id ? "bg-[var(--accent)] text-white dark:text-black" : "hover:bg-[var(--card)]"
            }`}
          >
            {n.label}
            {n.id === "favorites" && state.favorites.length > 0 ? ` (${state.favorites.length})` : ""}
          </button>
        ))}
      </nav>

      <div className="flex-1">
        <header className="flex flex-wrap items-center gap-3 border-b border-[var(--border)] bg-[var(--bg)] p-4 md:p-5">
          <div className="min-w-[14rem] flex-1">
            <label htmlFor="dashboard-search" className="sr-only">
              Search content
            </label>
            <input
              id="dashboard-search"
              type="search"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isFav ? "Search favorites" : "Search news, movies, and posts"}
              className="w-full rounded-md border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm outline-none"
            />
          </div>

          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className={headerBtn}>
            Settings
          </button>
          <button type="button" onClick={() => dispatch(toggleDark())} aria-pressed={state.dark} className={headerBtn}>
            Dark mode
          </button>
          <button
  type="button"
  onClick={() => setAcct((v) => !v)}
  aria-expanded={acct}
  aria-label="Account"
  className="grid h-9 w-9 cursor-pointer select-none place-items-center rounded-full bg-[var(--accent)] text-sm font-semibold text-white transition hover:ring-2 hover:ring-[var(--accent)] hover:ring-offset-2 hover:ring-offset-[var(--bg)] dark:text-black"
>
  G
</button>
        </header>

        {(open || acct) && (
          <div className="grid gap-3 border-b border-[var(--border)] bg-[var(--card)] p-4 md:grid-cols-[1fr_auto] md:p-5">
            {open && (
              <motion.section initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} aria-label="Category settings">
                <h2 className="mb-2 text-sm font-semibold">Categories</h2>
                <div className="flex flex-wrap gap-2">
                  {CATS.map((cat) => {
                    const active = state.categories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => dispatch(toggleCategory(cat))}
                        aria-pressed={active}
                        className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm capitalize transition ${
                          active
                            ? "border-[var(--accent)] bg-[var(--accent)] text-white dark:text-black"
                            : "border-[var(--border)] hover:border-[var(--accent)]"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </motion.section>
            )}

            {acct && (
              <motion.section initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} aria-label="Account menu">
                <h2 className="mb-2 text-sm font-semibold">Guest profile</h2>
                <p className="text-sm opacity-70">Preferences are saved on this device.</p>
              </motion.section>
            )}
          </div>
        )}

        <main className="mx-auto max-w-5xl p-4 md:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm capitalize text-[var(--accent)]">{state.status === "loading" ? "Loading" : state.section}</p>
              <h2 className="text-2xl font-bold">{title}</h2>
            </div>
            <p className="text-sm opacity-70">{items.length} items</p>
          </div>

          {state.status === "error" && (
            <div role="alert" className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
              <p>{state.error ?? "Could not load content. Check your connection and try again."}</p>
              <button
                type="button"
                onClick={() => dispatch(fetchContent({ reset: true, query: q }))}
                className="mt-3 cursor-pointer rounded-md bg-red-600 px-3 py-1.5 text-white"
              >
                Retry
              </button>
            </div>
          )}

          {state.status !== "error" && items.length === 0 && state.status !== "loading" && (
            <div className="rounded-md border border-dashed border-[var(--border)] bg-[var(--card)] p-8 text-center">
              <h3 className="font-semibold">No content found</h3>
              <p className="mt-1 text-sm opacity-70">Try a different search or category mix.</p>
            </div>
          )}

          {items.length > 0 && (
            <Feed items={items} favIds={favIds} onFav={(item) => dispatch(toggleFavorite(item))} onMore={loadMore} canMore={!isFav && state.hasMore} />
          )}

          {state.status === "loading" && (
            <div className="py-6 text-center text-sm opacity-70" aria-live="polite">
              Loading content...
            </div>
          )}
        </main>
      </div>
    </div>
  );
}