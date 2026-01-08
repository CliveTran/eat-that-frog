import { Link, useLocation } from "react-router";
import { Banknote, BookOpen, Calendar, CheckCircle2, Info, Lightbulb, ListTodo, Target } from "lucide-react";
import { cn } from "~/lib/utils";

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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="bg-green-600 rounded-full p-1">
                <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <span className="hidden font-bold sm:inline-block">
              Leap
            </span>
          </Link>
          <div className="flex items-center space-x-1 sm:space-x-4 md:space-x-6 text-sm font-medium overflow-x-auto scrollbar-hide w-full sm:w-auto px-2 sm:px-0">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "transition-colors hover:text-foreground/80 flex items-center gap-2 px-2 py-1 sm:px-0 shrink-0",
                  location.pathname === link.to ? "text-foreground" : "text-foreground/60"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span className="hidden md:inline-block">{link.label}</span>
                <span className="md:hidden sr-only">{link.label}</span> {/* Accessible label */}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Future standard search or actions */}
          </div>
        </div>
      </div>
    </nav>
  );
}
