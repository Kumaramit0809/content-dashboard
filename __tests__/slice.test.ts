import reducer, { hydrate, toggleCategory, toggleFavorite, toggleDark } from "@/store/slice";
import { Item } from "@/lib/types";
const init = reducer(undefined, { type: "init" });
const item: Item = { id: "1", type: "news", title: "t", description: "d", url: "u", category: "c" };

test("toggles a category on and off", () => {
  const a = reducer(init, toggleCategory("health"));
  expect(a.categories).toContain("health");
  expect(reducer(a, toggleCategory("health")).categories).not.toContain("health");
});
test("adds and removes favorites", () => {
  const a = reducer(init, toggleFavorite(item));
  expect(a.favorites).toHaveLength(1);
  expect(reducer(a, toggleFavorite(item)).favorites).toHaveLength(0);
});
test("toggles dark mode and hydrates saved prefs", () => {
  expect(reducer(init, toggleDark()).dark).toBe(true);
  const h = reducer(init, hydrate({ dark: true, categories: ["finance"] }));
  expect(h.dark).toBe(true);
  expect(h.categories).toEqual(["finance"]);
});
