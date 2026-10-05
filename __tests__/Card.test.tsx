import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Card from "@/components/Card";
import { Item } from "@/lib/types";
const movie: Item = { id: "m", type: "movie", title: "Dune", description: "Sand", url: "https://x.y", category: "movies" };

test("shows a CTA that matches the content type", () => {
  render(<Card item={movie} fav={false} onFav={() => {}} />);
  expect(screen.getByRole("link", { name: "Watch Now" })).toHaveAttribute("href", "https://x.y");
});
test("calls onFav when the favorite button is clicked", async () => {
  const onFav = jest.fn();
  render(<Card item={movie} fav={false} onFav={onFav} />);
  await userEvent.click(screen.getByRole("button", { name: /add dune to favorites/i }));
  expect(onFav).toHaveBeenCalled();
});
