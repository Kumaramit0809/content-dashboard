"use client";
import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { hydrate } from "@/store/slice";

const KEY = "dashboard-prefs";
export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) store.dispatch(hydrate(JSON.parse(saved)));
    } catch {}
    return store.subscribe(() => {
      const { categories, dark, favorites } = store.getState().app;
      try { localStorage.setItem(KEY, JSON.stringify({ categories, dark, favorites })); } catch {}
    });
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
