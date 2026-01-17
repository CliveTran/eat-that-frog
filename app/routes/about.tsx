import type { Route } from "./+types/about";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Banknote, BookOpen, Calendar, Lightbulb, Monitor, Moon, Target } from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "About - Leap" },
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

      <div className="space-y-6 pt-8 border-t">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">The Leap Ecosystem</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Leap goes beyond just daily tasks. It's a complete system for holistic self-improvement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle className="text-lg">Goals</CardTitle>
              <CardDescription>Long-term Vision</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Set ambitious yearly goals and break them down into actionable steps. Track your progress with our weighted completion system.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Banknote className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">Money</CardTitle>
              <CardDescription>Financial Freedom</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Take control of your finances. Track income, expenses, and savings goals to build the wealth necessary for your leap.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-500 mb-2" />
              <CardTitle className="text-lg">Books</CardTitle>
              <CardDescription>Continuous Learning</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Leaders are readers. Maintain your reading list, track your insights, and apply what you learn to grow every day.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lightbulb className="h-8 w-8 text-yellow-500 mb-2" />
              <CardTitle className="text-lg">Ideas</CardTitle>
              <CardDescription>Spark & Inspiration</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Never lose a brilliant thought again. Capture random ideas, inspirations, and "someday" projects in your personal incubator.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Monitor className="h-8 w-8 text-indigo-500 mb-2" />
              <CardTitle className="text-lg">Focus Mode</CardTitle>
              <CardDescription>Deep Work</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Enter the flow state with our built-in Pomodoro timer, distraction logger, and screentime analytics.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-orange-500 mb-2" />
              <CardTitle className="text-lg">Schedule</CardTitle>
              <CardDescription>Time Blocking</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Plan your day with precision. Use time blocks to ensure your "Frogs" get the dedicated attention they deserve.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Moon className="h-8 w-8 text-slate-700 dark:text-slate-300 mb-2" />
              <CardTitle className="text-lg">Dark Mode</CardTitle>
              <CardDescription>Visual Comfort</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Work comfortably day or night with our fully responsive dark mode, designed to reduce eye strain and look premium.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
