import { Item } from "@/lib/types";
const CTA = { news: "Read More", movie: "Watch Now", social: "View Post" };
export default function Card({ item, fav, onFav }: { item: Item; fav: boolean; onFav: () => void }) {
  return (
    <article className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
      {item.image && <img src={item.image} alt="" loading="lazy" className="h-24 w-32 shrink-0 rounded-lg object-cover" />}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-[var(--accent)]">{item.type} in {item.category}</p>
        <h3 className="font-semibold leading-snug">{item.title}</h3>
        <p className="line-clamp-2 text-sm opacity-70">{item.description}</p>
        <div className="mt-2 flex items-center gap-4">
          <a href={item.url} target="_blank" rel="noreferrer" className="rounded-md bg-[var(--accent)] px-3 py-1 text-sm text-white dark:text-black">{CTA[item.type]}</a>
          <button onClick={onFav} aria-pressed={fav} aria-label={fav ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`} className="text-sm">
            {fav ? "★ Favorited" : "☆ Favorite"}
          </button>
        </div>
      </div>
    </article>
  );
}
