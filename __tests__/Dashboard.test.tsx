import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import Dashboard from "@/components/Dashboard";
import { store } from "@/store/store";
const ui = () => render(<Provider store={store}><Dashboard /></Provider>);

test("renders fetched content", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [{ id: "a", type: "news", title: "Hello world", description: "d", url: "u", category: "technology" }] }) as any;
  ui();
  expect(await screen.findAllByText("Hello world")).not.toHaveLength(0);
});
test("shows an empty state when nothing is returned", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [] }) as any;
  ui();
  expect(await screen.findByText(/No content found/i)).toBeInTheDocument();
});
test("shows an error with retry when the API fails", async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) }) as any;
  ui();
  expect(await screen.findByRole("alert")).toHaveTextContent(/Could not load content/i);
});
