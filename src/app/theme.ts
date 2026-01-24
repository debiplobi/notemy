import type { MantineThemeOverride } from "@mantine/core";

/* -------------------------------- */
/* DARKER BORDER TOKEN              */
/* -------------------------------- */
const BORDER =
  "1px solid light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-3))";

const INPUT_PADDING = {
  paddingInline: "0.875rem",
  paddingBlock: "0.65rem",
};

const theme: MantineThemeOverride = {
  /* -------------------------------- */
  /* COLORS                           */
  /* -------------------------------- */
  colors: {
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
      "#9aa8c7", // slightly darker mid-gray
      "#7b8cb8",
      "#4b5c8b",
      "#2a334d",
      "#090b10",
    ],
    blue: [
      "#ddf4ff",
      "#b6e3ff",
      "#80ccff",
      "#54aeff",
      "#218bff",
      "#0969da",
      "#0550ae",
      "#033d8b",
      "#0a3069",
      "#002155",
    ],
    green: [
      "#dafbe1",
      "#aceebb",
      "#6fdd8b",
      "#4ac26b",
      "#2da44e",
      "#1a7f37",
      "#116329",
      "#044f1e",
      "#003d16",
      "#002d11",
    ],
    yellow: [
      "#fff8c5",
      "#fae17d",
      "#eac54f",
      "#d4a72c",
      "#bf8700",
      "#9a6700",
      "#7d4e00",
      "#633c01",
      "#4d2d00",
      "#3b2300",
    ],
    orange: [
      "#fff1e5",
      "#ffd8b5",
      "#ffb77c",
      "#fb8f44",
      "#e16f24",
      "#bc4c00",
      "#953800",
      "#762c00",
      "#5c2200",
      "#471700",
    ],
    red: [
      "#fff5f5",
      "#ffe3e3",
      "#ffc9c9",
      "#ffa8a8",
      "#ff8787",
      "#ff6b6b",
      "#fa5252",
      "#f03e3e",
      "#e03131",
      "#c92a2a",
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

  /* -------------------------------- */
  /* TYPOGRAPHY                       */
  /* -------------------------------- */
  fontFamily: "Lato",
  fontFamilyMonospace: "monospace",
  headings: {
    fontFamily: "Geist",
    fontWeight: "500",
  },

  /* -------------------------------- */
  /* LAYOUT                           */
  /* -------------------------------- */
  scale: 1,
  radius: {
    xs: "0.325rem",
    sm: "0.75rem",
    md: "0.7rem",
    lg: "1.2rem",
    xl: "2.4rem",
  },
  defaultRadius: "md",

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.25rem",
    xl: "1.5rem",
  },

  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "88em",
  },

  fontSmoothing: true,
  respectReducedMotion: false,
  focusRing: "auto",
  cursorType: "pointer",

  /* -------------------------------- */
  /* COMPONENT STYLES                 */
  /* -------------------------------- */
  components: {
    Paper: {
      styles: { root: { border: BORDER } },
    },

    Card: {
      defaultProps: {
        withBorder: true,
      },
      styles: {
        root: {
          border: BORDER,
          backgroundColor:
            "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
        },
      },
    },

    Modal: {
      styles: {
        content: { border: BORDER },
        header: { borderBottom: BORDER },
      },
    },

    Drawer: {
      styles: {
        content: { borderLeft: BORDER },
        header: { borderBottom: BORDER },
      },
    },

    Popover: {
      styles: {
        dropdown: { border: BORDER },
      },
    },

    Tooltip: {
      styles: {
        tooltip: { border: BORDER },
      },
    },

    /* -------- Inputs -------- */
    Input: {
      styles: {
        input: {
          border: BORDER,
          ...INPUT_PADDING,
        },
      },
    },

    Textarea: {
      styles: {
        input: {
          border: BORDER,
          ...INPUT_PADDING,
        },
      },
    },

    Select: {
      styles: {
        input: {
          border: BORDER,
          ...INPUT_PADDING,
        },
      },
    },

    Button: {
      styles: {
        root: {
          border: BORDER,
        },
      },
    },

    Table: {
      styles: {
        table: { border: BORDER },
        th: { borderBottom: BORDER },
        td: { borderBottom: BORDER },
      },
    },

    Divider: {
      styles: {
        root: {
          borderColor:
            "light-dark(var(--mantine-color-gray-5), var(--mantine-color-dark-3))",
        },
      },
    },
  },
};

export default theme;
