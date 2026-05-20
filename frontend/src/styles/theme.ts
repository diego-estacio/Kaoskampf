export const colors = {
  // Cores principais (Kaoskampf - Dark + Purple)
  primary: "#8b5cf6",
  primaryHover: "#7c3aed",
  primaryLight: "#2d1b6b",

  // Cores secundárias
  secondary: "#718096",
  secondaryHover: "#4a5568",
  secondaryLight: "#2d2d4e",

  // Cores de sucesso
  success: "#10b981",
  successHover: "#059669",
  successLight: "#064e3b",

  // Cores de aviso
  warning: "#fbbf24",
  warningHover: "#f59e0b",
  warningLight: "#3b2a0a",

  // Cores de erro
  error: "#f87171",
  errorHover: "#ef4444",
  errorLight: "#3b1a1a",

  // Cores neutras (dark)
  white: "#e2e8f0",
  gray50: "#2d2d4e",
  gray100: "#252540",
  gray200: "#2d2d4e",
  gray300: "#3d3d5c",
  gray400: "#4a4a6a",
  gray500: "#718096",
  gray600: "#a0aec0",
  gray700: "#cbd5e0",
  gray800: "#e2e8f0",
  gray900: "#f7fafc",

  // Cores de status do lead
  leadFrio: "#8b5cf6",
  leadMorno: "#f59e0b",
  leadQuente: "#10b981",

  // Cores de fundo (dark)
  backgroundMain: "#0f0f1a",
  backgroundCard: "#1a1a2e",
  backgroundSidebar: "#12121f",
};

export const fonts = {
  primary:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  secondary:
    '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
};

export const fontSizes = {
  xs: "0.75rem", // 12px
  sm: "0.875rem", // 14px
  base: "1rem", // 16px
  lg: "1.125rem", // 18px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "1.875rem", // 30px
  "4xl": "2.25rem", // 36px
  "5xl": "3rem", // 48px
};

export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
  "3xl": "2rem", // 32px
  "4xl": "2.5rem", // 40px
  "5xl": "3rem", // 48px
  "6xl": "4rem", // 64px
};

export const borderRadius = {
  none: "0",
  sm: "0.125rem", // 2px
  base: "0.25rem", // 4px
  md: "0.375rem", // 6px
  lg: "0.5rem", // 8px
  xl: "0.75rem", // 12px
  "2xl": "1rem", // 16px
  full: "9999px",
};

export const shadows = {
  sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  base: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  inner: "inset 0 2px 4px 0 rgb(0 0 0 / 0.1)",
};

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

export const zIndex = {
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  notification: 70,
};
