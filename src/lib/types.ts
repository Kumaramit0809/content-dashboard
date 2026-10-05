export interface Item {
  id: string;
  type: "news" | "movie" | "social";
  title: string;
  description: string;
  image?: string;
  url: string;
  category: string;
}
