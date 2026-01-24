"use client";
import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeToggle() {
  const { toggleColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme("dark");

  return (
    <ActionIcon
      variant="transparent"
      size="lg"
      aria-label="Toggle theme"
      onClick={toggleColorScheme}
    >
      {colorScheme === "dark" ? (
        <IconMoon key="dark" size={20} stroke={2} />
      ) : (
        <IconSun key="light" size={20} stroke={2} />
      )}
    </ActionIcon>
  );
}
