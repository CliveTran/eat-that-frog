import type { Route } from "./+types/books";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Books - Leap" },
    { name: "description", content: "Track your reading list." },
  ];
}

export default function Books() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Books</h1>
        <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}
