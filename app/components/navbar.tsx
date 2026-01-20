import { Link, useLocation } from "react-router";
import { Banknote, BookOpen, Brain, Calendar, CheckCircle2, Info, Lightbulb, ListTodo, Menu, Monitor, Moon, Sun, Target } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "~/components/theme-provider";

export function Navbar() {
  const location = useLocation();
  const { setTheme } = useTheme();

  const links = [
    {
      to: "/",
      label: "Frogs",
      icon: ListTodo,
    },
    {
      to: "/schedule",
      label: "Schedule",
      icon: Calendar,
    },
    {
      to: "/goals",
      label: "Goals",
      icon: Target,
    },
    {
      to: "/money",
      label: "Money",
      icon: Banknote,
    },
    {
      to: "/books",
      label: "Books",
      icon: BookOpen,
    },
    {
      to: "/screentime",
      label: "Focus",
      icon: Monitor,
    },
    {
      to: "/ideas",
      label: "Ideas",
      icon: Lightbulb,
    },
    {
      to: "/philosophy",
      label: "Philosophy",
      icon: Brain,
    },
    {
      to: "/about",
      label: "About",
      icon: Info,
    },
  ];

  const ThemeToggle = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="bg-green-600 rounded-full p-1">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold inline-block">
              Leap
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "transition-colors hover:text-foreground/80 flex items-center gap-2",
                  location.pathname === link.to ? "text-foreground" : "text-foreground/60"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Nav & Toggle */}
        <div className="flex items-center gap-2">
          {/* Always show Theme Toggle on Desktop, hide on mobile if inside menu? 
              Actually, let's show it always. 
              But the requirement was to put it in the "Future standard search" area for desktop.
              Let's put it here for both for now, or use responsive classes.
          */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                {links.map((link) => (
                  <DropdownMenuItem key={link.to} asChild>
                    <Link to={link.to} className="flex items-center gap-2 cursor-pointer w-full">
                      <link.icon className="h-4 w-4 mr-2" />
                      <span>{link.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <div className="p-2">
                  <p className="text-xs text-muted-foreground mb-2 px-1">Theme</p>
                  <div className="flex justify-around">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setTheme('light')}><Sun className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setTheme('dark')}><Moon className="h-4 w-4" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setTheme('system')}><Monitor className="h-4 w-4" /></Button>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
