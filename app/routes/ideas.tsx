import type { Route } from "./+types/ideas";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ideas - Leap" },
    { name: "description", content: "Capture your ideas and inspirations." },
  ];
}

export default function Ideas() {
  return (
    <div className="container py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Ideas & Inspirations</h1>
        <p className="text-muted-foreground">Coming soon...</p>
    </div>
  );
}
