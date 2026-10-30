import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "ap-theme";

export function applyStoredTheme() {
  if (typeof document === "undefined") return;
  const stored = localStorage.getItem(KEY);
  const dark = stored ? stored === "dark" : true;
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    setDark(stored ? stored === "dark" : true);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem(KEY, next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle color theme">
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
