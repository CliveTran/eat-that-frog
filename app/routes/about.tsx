import type { Route } from "./+types/about";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About - Eat That Frog!" },
  ];
}

export default function About() {
  return (
    <div className="container py-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">The "Eat That Frog" Method</h1>
        <p className="text-xl text-muted-foreground">
          Stop procrastinating and get more done by tackling your biggest tasks first.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="default" className="text-lg w-8 h-8 flex items-center justify-center p-0">1</Badge>
              Identify Your Frog
            </CardTitle>
          </CardHeader>
          <CardContent>
            Your "frog" is your biggest, most important task, the one you are most likely to procrastinate on if you don't do something about it. It is also the one that can have the greatest positive impact on your life and results.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="default" className="text-lg w-8 h-8 flex items-center justify-center p-0">2</Badge>
              Eat It First
            </CardTitle>
          </CardHeader>
          <CardContent>
            First thing in the morning, do your most difficult task. Don't think about it too much. Just do it. If you have to eat two frogs, eat the ugliest one first.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg w-8 h-8 flex items-center justify-center p-0">3</Badge>
              Why It Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            Starting your day with a win releases dopamine and builds momentum. By clearing the biggest hurdle first, the rest of the day feels lighter and easier.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge variant="secondary" className="text-lg w-8 h-8 flex items-center justify-center p-0">4</Badge>
              The ABCDE Method
            </CardTitle>
          </CardHeader>
          <CardContent>
             Prioritize tasks by consequence:
             <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-muted-foreground">
                <li><strong>A:</strong> Must do (Serious consequences)</li>
                <li><strong>B:</strong> Should do (Mild consequences)</li>
                <li><strong>C:</strong> Nice to do (No consequences)</li>
                <li><strong>D:</strong> Delegate</li>
                <li><strong>E:</strong> Eliminate</li>
             </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
