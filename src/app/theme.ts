import { createTheme } from "@mantine/core";

export const theme = createTheme({
  colors: {
    /* (UNCHANGED – your palette is kept as-is) */
    dark: [
      "#fafcff",
      "#cad5e8",
      "#8697b5",
      "#4c5d7d",
      "#222833",
      "#222938",
      "#0b0f14",
      "#0b0f14",
      "#030405",
      "#000000",
    ],
    gray: [
      "#e3e7f1",
      "#d8ddeb",
      "#ced4e5",
      "#c3cadf",
      "#b8c1d9",
      "#b8c1d9",
      "#7b8cb8",
      "#4b5c8b",
      "#2a334d",
      "#090b10",
    ],
    Remoraid: [
      "#dcf2de",
      "#c7eccc",
      "#b2e6b9",
      "#9de1a6",
      "#88db93",
      "#88db93",
      "#5fc26d",
      "#479454",
      "#296133",
      "#19361d",
    ],
  },

  primaryColor: "Remoraid",
  primaryShade: { light: 6, dark: 5 },

  white: "#ffffff",
  black: "#24292f",

  autoContrast: true,
  luminanceThreshold: 0.3,

  /* ---------------- Typography ---------------- */
  fontFamily: "JetBrains Mono, monospace",
  fontFamilyMonospace: "JetBrains Mono, monospace",

  fontSizes: {
    xs: "0.7rem",
    sm: "0.8rem",
    md: "0.9rem", // base (important for mono)
    lg: "1rem",
    xl: "1.1rem",
  },

  lineHeights: {
    xs: "1.4",
    sm: "1.45",
    md: "1.5",
    lg: "1.55",
    xl: "1.6",
  },

  headings: {
    fontFamily: "JetBrains Mono, monospace",
    fontWeight: "600",
  },

  /* ---------------- Sharp Corners ---------------- */
  radius: {
    xs: "0px",
    sm: "0px",
    md: "0px",
    lg: "0px",
    xl: "0px",
  },

  defaultRadius: "xs",

  /* ---------------- Layout ---------------- */
  spacing: {
    xs: "0.525rem",
    sm: "0.65rem",
    md: "0.9rem",
    lg: "1.35rem",
    xl: "2.2rem",
  },

  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "88em",
  },

  fontSmoothing: true,
  focusRing: "auto",
  cursorType: "default",

  /* ---------------- Component Overrides ---------------- */
  components: {
    Input: {
      defaultProps: {
        radius: "xs",
        size: "sm",
      },
    },

    Button: {
      defaultProps: {
        radius: "xs",
        size: "sm",
      },
    },

    Card: {
      defaultProps: {
        withBorder: true,
        radius: "xs",
      },
    },

    Modal: {
      defaultProps: {
        radius: "xs",
      },
    },
  },
});
