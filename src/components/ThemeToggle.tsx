"use client";

import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LightThemeIcon = () => (
  <motion.svg
    aria-label="Light theme icon"
    role="img"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.1, ease: "easeOut" }}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
    </g>
  </motion.svg>
);

const DarkThemeIcon = () => (
  <motion.svg
    aria-label="Dark theme icon"
    role="img"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{ duration: 0.1, ease: "easeOut" }}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"
    />
  </motion.svg>
);

export function ThemeToggle() {
  const { toggleColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ActionIcon
      variant="outline"
      size="lg"
      aria-label="Toggle theme"
      onClick={toggleColorScheme}
    >
      <AnimatePresence mode="wait">
        {mounted &&
          (colorScheme === "dark" ? (
            <DarkThemeIcon key="dark" />
          ) : (
            <LightThemeIcon key="light" />
          ))}
      </AnimatePresence>
    </ActionIcon>
  );
}
