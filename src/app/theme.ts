import { createTheme } from "@mantine/core";

export const theme = createTheme({
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

  fontFamily: "JetBrains Mono, monospace",
  fontFamilyMonospace: "JetBrains Mono, monospace",
  fontSizes: {
    xs: "0.7rem",
    sm: "0.8rem",
    md: "0.9rem",
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

  radius: {
    xs: "0px",
    sm: "0px",
    md: "0px",
    lg: "0px",
    xl: "0px",
  },
  defaultRadius: "xs",

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

  // Better dimmed text colors
  other: {
    dimmedColor: "light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-2))",
  },

  components: {
    // Form Inputs
    Input: {
      defaultProps: { radius: "xs", size: "sm" },
      styles: {
        input: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))",
          color: "light-dark(var(--mantine-color-black), var(--mantine-color-dark-0))",
          "&:focus": {
            borderColor: "var(--mantine-color-Remoraid-6)",
          },
        },
      },
    },
    TextInput: {
      defaultProps: { radius: "xs", size: "sm" },
    },
    Textarea: {
      defaultProps: { radius: "xs", size: "sm" },
    },
    NumberInput: {
      defaultProps: { radius: "xs", size: "sm" },
    },
    PasswordInput: {
      defaultProps: { radius: "xs", size: "sm" },
    },
    Select: {
      defaultProps: { radius: "xs", size: "sm" },
    },
    MultiSelect: {
      defaultProps: { radius: "xs", size: "sm" },
    },
    Checkbox: {
      defaultProps: { size: "sm" },
      styles: {
        input: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          "&:checked": {
            backgroundColor: "var(--mantine-color-Remoraid-6)",
            borderColor: "var(--mantine-color-Remoraid-6)",
          },
        },
      },
    },
    Radio: {
      defaultProps: { size: "sm" },
      styles: {
        radio: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          "&:checked": {
            borderColor: "var(--mantine-color-Remoraid-6)",
          },
        },
      },
    },
    Switch: {
      defaultProps: { size: "sm" },
      styles: {
        track: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },

    // Buttons
    Button: {
      defaultProps: { radius: "xs", size: "sm" },
      styles: {
        root: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },
    ActionIcon: {
      defaultProps: { radius: "xs", size: "sm" },
      styles: {
        root: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },
    UnstyledButton: {
      defaultProps: { radius: "xs" },
    },

    // Containers
    Card: {
      defaultProps: { withBorder: true, radius: "xs" },
      styles: {
        root: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))",
        },
      },
    },
    Paper: {
      defaultProps: { radius: "xs" },
      styles: {
        root: {
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))",
        },
      },
    },
    Container: {
      defaultProps: { size: "lg" },
    },
    Box: {
      styles: {
        root: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },

    // Overlays
    Modal: {
      defaultProps: { radius: "xs" },
      styles: {
        content: {
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
        },
        header: {
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
          borderBottom: "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },
    Drawer: {
      defaultProps: { radius: "xs" },
      styles: {
        content: {
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
        },
        header: {
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))",
          borderBottom: "1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },
    Popover: {
      defaultProps: { radius: "xs" },
      styles: {
        dropdown: {
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))",
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },
    Tooltip: {
      defaultProps: { radius: "xs" },
      styles: {
        tooltip: {
          backgroundColor: "light-dark(var(--mantine-color-dark-9), var(--mantine-color-dark-4))",
          color: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-0))",
        },
      },
    },
    Menu: {
      defaultProps: { radius: "xs" },
      styles: {
        dropdown: {
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))",
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
        item: {
          "&[data-hovered]": {
            backgroundColor: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5))",
          },
        },
      },
    },

    // Navigation
    Tabs: {
      defaultProps: { radius: "xs" },
      styles: {
        tab: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          "&[data-active]": {
            borderColor: "var(--mantine-color-Remoraid-6)",
            color: "var(--mantine-color-Remoraid-6)",
          },
        },
      },
    },
    NavLink: {
      styles: {
        root: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          "&[data-active]": {
            backgroundColor: "light-dark(var(--mantine-color-Remoraid-0), var(--mantine-color-dark-5))",
            color: "var(--mantine-color-Remoraid-6)",
          },
        },
      },
    },
    Breadcrumbs: {
      styles: {
        separator: {
          color: "light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-2))",
        },
      },
    },
    Pagination: {
      defaultProps: { radius: "xs", size: "sm" },
      styles: {
        control: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          "&[data-active]": {
            backgroundColor: "var(--mantine-color-Remoraid-6)",
            borderColor: "var(--mantine-color-Remoraid-6)",
          },
        },
      },
    },

    // Feedback
    Alert: {
      defaultProps: { radius: "xs" },
      styles: {
        root: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },
    Notification: {
      defaultProps: { radius: "xs" },
      styles: {
        root: {
          backgroundColor: "light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))",
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },
    Progress: {
      defaultProps: { radius: "xs", size: "sm" },
      styles: {
        root: {
          backgroundColor: "light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5))",
        },
      },
    },
    Loader: {
      defaultProps: { size: "sm" },
    },

    // Data Display
    Table: {
      styles: {
        table: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
        th: {
          backgroundColor: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5))",
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          color: "light-dark(var(--mantine-color-gray-8), var(--mantine-color-dark-1))",
        },
        td: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },
    Accordion: {
      defaultProps: { radius: "xs" },
      styles: {
        item: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
        control: {
          "&:hover": {
            backgroundColor: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5))",
          },
        },
      },
    },
    Badge: {
      defaultProps: { radius: "xs", size: "sm" },
    },
    Code: {
      styles: {
        root: {
          backgroundColor: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-5))",
          color: "light-dark(var(--mantine-color-dark-9), var(--mantine-color-dark-0))",
        },
      },
    },
    CodeHighlight: {
      defaultProps: { radius: "xs" },
      styles: {
        root: {
          backgroundColor: "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))",
        },
      },
    },

    // Miscellaneous
    Divider: {
      styles: {
        root: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },
    Slider: {
      defaultProps: { radius: "xs", size: "sm" },
      styles: {
        track: {
          backgroundColor: "light-dark(var(--mantine-color-gray-1), var(--mantine-color-dark-5))",
        },
        bar: {
          backgroundColor: "var(--mantine-color-Remoraid-6)",
        },
      },
    },
    Stepper: {
      styles: {
        separator: {
          backgroundColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
        stepIcon: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
          "&[data-completed]": {
            backgroundColor: "var(--mantine-color-Remoraid-6)",
            borderColor: "var(--mantine-color-Remoraid-6)",
          },
        },
      },
    },
    Timeline: {
      styles: {
        item: {
          borderColor: "light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-3))",
        },
      },
    },
  },
});
