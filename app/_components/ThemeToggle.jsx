// components/ThemeToggle.jsx
"use client";

import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const icon =
    theme === "light" ? (
      <Sun size={18} />
    ) : theme === "dark" ? (
      <Moon size={18} />
    ) : (
      <Laptop size={18} />
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded-lg border border-theme 
                     bg-primary text-dark
                     transition-colors flex items-center justify-center bg-pHover-hover"
        >
          {icon}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-36 rounded-xl shadow-lg border border-theme
                   bg-primary text-dark"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer focus:bg-secondary bg-pHover-hover"
        >
          <Sun size={16} className="mr-2 text-accent" />
          Light
          {theme === "light" && <Check size={14} className="ml-auto text-accent" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer focus:bg-secondary bg-pHover-hover"
        >
          <Moon size={16} className="mr-2 text-accent" />
          Dark
          {theme === "dark" && <Check size={14} className="ml-auto text-accent" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer focus:bg-secondary bg-pHover-hover"
        >
          <Laptop size={16} className="mr-2 text-accent" />
          System
          {theme === "system" && <Check size={14} className="ml-auto text-accent" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}