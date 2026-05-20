/**
 * Centralized CSS variable references — matches :root vars defined in globals.css.
 * Use in styled-components template literals: ${c.primary}
 * Example: `background: ${c.bgPrimary};`
 */
export const c = {
  // ── Primary (purple) ──────────────────────────────────────────────
  primary: "var(--color-primary)",
  primaryHover: "var(--color-primary-hover)",
  primaryDark: "var(--color-primary-dark)",
  primaryLight: "var(--color-primary-light)",

  // ── Text ──────────────────────────────────────────────────────────
  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  textTertiary: "var(--color-text-tertiary)",
  textDisabled: "var(--color-text-disabled)",

  // ── Backgrounds ───────────────────────────────────────────────────
  bgPrimary: "var(--color-bg-primary)", // #1a1a2e  – cards / modals
  bgSecondary: "var(--color-bg-secondary)", // #0f0f1a  – main page background
  bgSidebar: "var(--color-bg-sidebar)", // #12121f  – sidebar / topbar
  bgElevated: "var(--color-bg-elevated)", // #1e1e3a  – hover rows / dividers
  bgTertiary: "var(--color-bg-tertiary)", // #16213e  – deep accent

  // ── Borders ───────────────────────────────────────────────────────
  borderLight: "var(--color-border-light)",
  borderMedium: "var(--color-border-medium)",
  borderDark: "var(--color-border-dark)",

  // ── Semantic ──────────────────────────────────────────────────────
  success: "var(--color-btn-success)",
  successHover: "var(--color-btn-success-hover)",
  successLight: "var(--color-btn-success-light)",
  successText: "var(--color-btn-success-text)",

  error: "var(--color-error)",
  errorHover: "var(--color-error-hover)",
  errorLight: "var(--color-error-light)",
  errorText: "var(--color-error-text)",

  warning: "var(--color-warning)",
  warningHover: "var(--color-warning-hover)",
  warningLight: "var(--color-warning-light)",
  warningText: "var(--color-warning-text)",

  // ── Status badges ─────────────────────────────────────────────────
  statusBlueBg: "var(--color-status-blue-bg)",
  statusBlueText: "var(--color-status-blue-text)",
  statusPurpleBg: "var(--color-status-purple-bg)",
  statusPurpleText: "var(--color-status-purple-text)",
  statusYellowBg: "var(--color-status-yellow-bg)",
  statusYellowText: "var(--color-status-yellow-text)",
  statusOrangeBg: "var(--color-status-orange-bg)",
  statusOrangeText: "var(--color-status-orange-text)",
  statusGreenBg: "var(--color-status-green-bg)",
  statusGreenText: "var(--color-status-green-text)",
} as const;

export type CssVar = (typeof c)[keyof typeof c];
