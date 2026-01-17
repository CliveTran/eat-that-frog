import { Link, useLocation } from "react-router";
import { Banknote, BookOpen, Calendar, CheckCircle2, Info, Lightbulb, ListTodo, Menu, Monitor, Target } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Navbar() {
  const location = useLocation();

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
      to: "/about",
      label: "About",
      icon: Info,
    },
  ];

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

        {/* Mobile Nav */}
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:flex items-center space-x-2">
          {/* Future standard search or actions */}
        </div>
      </div>
    </nav>
  );
}
