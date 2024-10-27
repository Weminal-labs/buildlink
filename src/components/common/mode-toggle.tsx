"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { IconDeviceImac } from "@tabler/icons-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getButtonClass = (buttonTheme: string) => {
    return `rounded-md ${
      theme === buttonTheme
        ? "bg-gray-200 text-gray-800"
        : "hover:bg-accent hover:text-accent-foreground"
    }`;
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center max-w-fit gap-2 border rounded-md p-1">
      <Button
        variant="ghost"
        className={getButtonClass("light")}
        size="icon"
        onClick={() => setTheme("light")}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>

      <Button
        variant="ghost"
        className={getButtonClass("system")}
        size="icon"
        onClick={() => setTheme("system")}
      >
        <IconDeviceImac className="h-[1.2rem] w-[1.2rem]" />
      </Button>
      <Button
        variant="ghost"
        className={getButtonClass("dark")}
        size="icon"
        onClick={() => setTheme("dark")}
      >
        <MoonIcon className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    </div>
  );
}
