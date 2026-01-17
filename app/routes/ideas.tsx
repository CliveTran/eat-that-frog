import { useState, useEffect, useRef } from "react";
import type { Route } from "./+types/ideas";
import { Button } from "~/components/ui/button";
import { Textarea } from "~/components/ui/textarea";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Sparkles, Plus, Trash2, Copy, Clock, Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Ideas - Leap" },
    { name: "description", content: "Capture your ideas and inspirations." },
  ];
}

interface Idea {
  id: string;
  content: string;
  timestamp: string;
}

export default function Ideas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load ideas from localStorage on mount
  useEffect(() => {
    const savedIdeas = localStorage.getItem("leap-ideas");
    if (savedIdeas) {
      try {
        setIdeas(JSON.parse(savedIdeas));
      } catch (error) {
        console.error("Failed to load ideas:", error);
      }
    }
  }, []);

  // Save ideas to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("leap-ideas", JSON.stringify(ideas));
  }, [ideas]);

  const handleAddIdea = () => {
    if (!inputValue.trim()) return;

    const newIdea: Idea = {
      id: crypto.randomUUID(),
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setIdeas((prev) => [newIdea, ...prev]);
    setInputValue("");
    // Re-focus textarea for rapid entry
    textareaRef.current?.focus();
  };

  const handleDeleteIdea = (id: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  };

  const handleCopyIdea = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Optional: Could add a toast here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleAddIdea();
    }
  };

  // Filter ideas based on search
  const filteredIdeas = ideas.filter(idea =>
    idea.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className="container py-8 px-4 md:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header & Hero Input */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-500 fill-yellow-500/20" />
            Ideas & Inspirations
          </h1>
          <p className="text-muted-foreground">
            A quick dump for your random thoughts. Press <kbd className="bg-muted px-1.5 py-0.5 rounded text-xs border">Ctrl + Enter</kbd> to save.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-30 transition blur"></div>
          <Card className="relative border-2 border-primary/10 shadow-lg">
            <CardContent className="p-4 pt-4">
              <Textarea
                ref={textareaRef}
                placeholder="What's on your mind?..."
                className="min-h-[120px] resize-none text-lg border-none focus-visible:ring-0 shadow-none p-0 bg-transparent placeholder:text-muted-foreground/50"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-muted-foreground opacity-50 hidden sm:inline-block">
                  Capture it before it flies away 🦋
                </span>
                <Button onClick={handleAddIdea} disabled={!inputValue.trim()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Save Idea
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Vault ({ideas.length})</h2>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ideas..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {ideas.length === 0 ? (
          <div className="text-center py-20 border-2 dashed rounded-xl">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No ideas yet</h3>
            <p className="text-muted-foreground mt-1">
              Your brain is waiting! Start typing above.
            </p>
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No ideas found matching "{searchQuery}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="group hover:border-primary/50 transition-colors flex flex-col">
                <CardContent className="p-5 flex-1 whitespace-pre-wrap text-sm leading-relaxed">
                  {idea.content}
                </CardContent>
                <CardFooter className="p-3 pt-0 flex justify-between items-center text-muted-foreground bg-muted/20 border-t">
                  <div className="flex items-center text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(idea.timestamp)}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopyIdea(idea.content)} title="Copy to clipboard">
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDeleteIdea(idea.id)} title="Delete idea">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
