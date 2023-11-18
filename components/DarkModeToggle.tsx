"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@tremor/react";

export default function DarkModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-2 flex items-center justify-between text-sm">
      <p>Dark mode</p>
      <Switch
        checked={theme === "dark"}
        color="indigo"
        onChange={() =>
          theme === "dark" ? setTheme("lignt") : setTheme("dark")
        }
      />
    </div>
  );
}
