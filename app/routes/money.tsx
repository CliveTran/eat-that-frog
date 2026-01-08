import type { Route } from "./+types/money";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Money - Leap" },
    { name: "description", content: "Track your finances." },
  ];
}

export default function Money() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Money</h1>
        <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}
