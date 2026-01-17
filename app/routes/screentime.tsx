import { useState, useEffect } from "react";
import type { Route } from "./+types/screentime";
import { FocusTimer } from "~/components/focus-timer";
import { SessionTracker } from "~/components/session-tracker";
import { DistractionLogger } from "~/components/distraction-logger";
import { FocusCharts } from "~/components/focus-charts";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Focus Mode - Leap" },
    { name: "description", content: "Manage your screen time and improve focus." },
  ];
}

interface Session {
  id: string;
  startTime: string;
  duration: number;
  distractions: number;
}

interface Distraction {
  id: string;
  text: string;
  timestamp: string;
}

export default function Screentime() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [distractions, setDistractions] = useState<Distraction[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("focus-sessions");
    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
  }, []);

  // Save to localStorage whenever sessions change
  useEffect(() => {
    localStorage.setItem("focus-sessions", JSON.stringify(sessions));
  }, [sessions]);

  const handleSessionComplete = (duration: number) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      startTime: new Date().toISOString(),
      duration,
      distractions: distractions.length,
    };

    setSessions(prev => [...prev, newSession]);
    setDistractions([]); // Reset distractions for the next session
  };

  const handleLogDistraction = (note: string) => {
    const newDistraction: Distraction = {
      id: crypto.randomUUID(),
      text: note,
      timestamp: new Date().toISOString()
    };
    setDistractions(prev => [...prev, newDistraction]);
  };

  // Calculate daily stats for the last 7 days
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString("en-US", { weekday: "short" });
    const fullDateStr = d.toLocaleDateString("en-US"); // Use full date for exact matching

    // Sum duration for this specific date
    const totalMinutes = Math.floor(
      sessions.reduce((acc, s) => {
        const sessionDate = new Date(s.startTime).toLocaleDateString("en-US");
        return sessionDate === fullDateStr ? acc + s.duration : acc;
      }, 0) / 60
    );

    return { date: dateStr, minutes: totalMinutes };
  });


  return (
    <div className="container py-8 px-4 md:px-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Focus Dashboard</h1>
          <p className="text-muted-foreground">Track your sessions and stay in the flow.</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-sm font-medium text-muted-foreground">Current Stream</div>
          <div className="text-2xl font-bold">{sessions.length} Sessions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Timer Area */}
        <div className="lg:col-span-2 space-y-6">
          <FocusTimer onSessionComplete={handleSessionComplete} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DistractionLogger
              onLogDistraction={handleLogDistraction}
              distractionHistory={distractions}
            />

            {/* Placeholder for future feature or inspirational quote */}
            <div className="bg-primary/5 rounded-xl p-6 flex flex-col justify-center items-center text-center space-y-4 border border-primary/10">
              <h3 className="font-semibold text-primary/80">Quote of the Moment</h3>
              <blockquote className="italic text-muted-foreground max-w-xs">
                "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus."
              </blockquote>
              <cite className="text-xs font-semibold not-italic">- Alexander Graham Bell</cite>
            </div>
          </div>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <SessionTracker sessions={sessions} />
          <FocusCharts data={chartData} />
        </div>
      </div>
    </div>
  );
}
