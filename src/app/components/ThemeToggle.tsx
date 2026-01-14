"use client";
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeToggle() {
  const { toggleColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme("dark");

  return (
    <ActionIcon
      variant="default"
      size="lg"
      onClick={toggleColorScheme}
      aria-label="Toggle theme"
    >
      {colorScheme === "dark" ? (
        <IconMoon className="tabler-icon tabler-icon-moon" size={18} />
      ) : (
        <IconSun className="tabler-icon tabler-icon-sun" size={18}/>
      )}
    </ActionIcon>
  );
}
