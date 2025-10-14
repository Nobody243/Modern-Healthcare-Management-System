/**
 * CureWell HMS — Centralized Design Theme Configuration (v4, Final)
 * Single source of truth for JavaScript/TypeScript colors, Recharts palettes,
 * SVG fills, and dynamic chart visualizations.
 * 
 * Synchronized with CSS tokens defined in `app/globals.css` and `curewell-hms-color-system-v4.md`.
 */

export const THEME_COLORS = {
  // Brand Core Scale (§3)
  primary: '#1AA8BB',         // Cyan 700 — Primary solid button fill (AA contrast with white)
  primaryHover: '#128293',    // Cyan 800 — Button hover
  primaryActive: '#0B5C68',   // Cyan 900 — Button active/pressed
  primaryForeground: '#FFFFFF',
  brandLink: '#26C6DA',       // Cyan 600 — Links/icons on light mode
  brandLinkDark: '#4DD0E1',   // Cyan 500 — Links/icons on dark mode
  brandSubtle: '#E0F7FA',     // Cyan 50 — Subtle badge background (light mode)
  accent: '#26C6DA',
  
  // Neutral Blue-Slate Chassis (§2)
  light: {
    background: '#E0FBFC',        // Neutral 100 — Canvas
    card: '#FFFFFF',              // White
    muted: '#C2DFE3',             // Neutral 200 — Muted fill / table header
    borderSubtle: '#AACBD3',      // Neutral 300
    borderStrong: '#9DB4C0',      // Neutral 400 — Inputs & strong borders
    textMuted: '#7B8E98',         // Neutral 500 — Placeholders, captions
    textSecondary: '#5C6B73',     // Neutral 600 — Secondary labels
    textPrimary: '#253237',       // Neutral 900 — Primary text
  },
  dark: {
    background: '#171E21',        // Neutral 950 — Canvas (no glare)
    card: '#303B41',              // Neutral 800 — Elevated card
    muted: '#435059',             // Neutral 700 — Muted fill
    borderSubtle: '#435059',      // Neutral 700
    borderStrong: '#5C6B73',      // Neutral 600
    textMuted: '#AACBD3',         // Neutral 300
    textSecondary: '#C2DFE3',     // Neutral 200
    textPrimary: '#F3FBFC',       // Neutral 50
  },

  // Portal Identity Accents (§4)
  portals: {
    doctor: {
      primary: '#0D9488',         // Teal
      hover: '#0F766E',
      active: '#115E59',
      subtle: '#F0FDFA',
      subtleDark: 'rgba(13, 148, 136, 0.15)',
      ring: '#2DD4BF',
      textSubtle: '#0F766E',
      textSubtleDark: '#2DD4BF',
      from: '#0D9488',
      to: '#0F766E',
      accent: '#2DD4BF',
      bgGlow: 'rgba(13, 148, 136, 0.15)',
    },
    patient: {
      primary: '#2563EB',         // Blue
      hover: '#1D4ED8',
      active: '#1E40AF',
      subtle: '#EFF6FF',
      subtleDark: 'rgba(37, 99, 235, 0.15)',
      ring: '#60A5FA',
      textSubtle: '#1D4ED8',
      textSubtleDark: '#60A5FA',
      from: '#2563EB',
      to: '#1D4ED8',
      accent: '#60A5FA',
      bgGlow: 'rgba(37, 99, 235, 0.15)',
    },
    admin: {
      primary: '#8B4A2E',         // Terracotta / Clay Brown (Warm & desaturated)
      hover: '#6E3A22',
      active: '#582D1B',
      subtle: '#FBF0EA',
      subtleDark: 'rgba(139, 74, 46, 0.15)',
      ring: '#C08A6B',
      textSubtle: '#6E3A22',
      textSubtleDark: '#C08A6B',
      from: '#8B4A2E',
      to: '#6E3A22',
      accent: '#C08A6B',
      bgGlow: 'rgba(139, 74, 46, 0.15)',
    },
  },

  // Locked Clinical Semantics (§5)
  semantics: {
    critical: {
      accent: '#DC2626',
      hover: '#B91C1C',
      subtleLight: '#FEF2F2',
      subtleDark: 'rgba(220, 38, 38, 0.15)',
      textLight: '#B91C1C',
      textDark: '#FCA5A5',
    },
    warning: {
      accent: '#D97706',
      hover: '#B45309',
      subtleLight: '#FFFBEB',
      subtleDark: 'rgba(217, 119, 6, 0.15)',
      textLight: '#B45309',
      textDark: '#FCD34D',
    },
    normal: {
      accent: '#16A34A',
      hover: '#15803D',
      subtleLight: '#F0FDF4',
      subtleDark: 'rgba(22, 163, 74, 0.15)',
      textLight: '#15803D',
      textDark: '#86EFAC',
    },
    info: {
      accent: '#1AA8BB',
      hover: '#128293',
      subtleLight: '#E0F7FA',
      subtleDark: 'rgba(26, 168, 187, 0.15)',
      textLight: '#0B5C68',
      textDark: '#67E8F9',
    },
  },

  // Semantic KPI & Stat Tokens
  kpi: {
    primary: {
      from: '#1AA8BB',
      to: '#26C6DA',
      icon: '#26C6DA',
      border: 'rgba(26, 168, 187, 0.35)',
      bg: 'rgba(26, 168, 187, 0.12)',
    },
    success: {
      from: '#16A34A',
      to: '#22C55E',
      icon: '#16A34A',
      border: 'rgba(22, 163, 74, 0.35)',
      bg: 'rgba(22, 163, 74, 0.12)',
    },
    warning: {
      from: '#D97706',
      to: '#F59E0B',
      icon: '#D97706',
      border: 'rgba(217, 119, 6, 0.35)',
      bg: 'rgba(217, 119, 6, 0.12)',
    },
    info: {
      from: '#1AA8BB',
      to: '#818CF8',
      icon: '#26C6DA',
      border: 'rgba(26, 168, 187, 0.35)',
      bg: 'rgba(26, 168, 187, 0.12)',
    },
    danger: {
      from: '#DC2626',
      to: '#EF4444',
      icon: '#DC2626',
      border: 'rgba(220, 38, 38, 0.35)',
      bg: 'rgba(220, 38, 38, 0.12)',
    },
  },

  // Fallback / legacy constants
  backgroundDark: '#171E21',
  backgroundCard: '#303B41',
  backgroundMuted: '#435059',
  border: '#AACBD3',
  borderLight: '#C2DFE3',
  textHeading: '#253237',
  textBody: '#5C6B73',
  textMuted: '#7B8E98',
} as const;

/**
 * Recharts Data Visualization Palettes (§7)
 */
export const CHART_PALETTES = {
  // Biometric Vitals Series (§7.1)
  vitals: {
    heartRate: '#26C6DA',       // Brand Cyan
    bloodPressure: '#F43F5E',   // Rose
    spO2: '#16A34A',            // Normal Green
    temperature: '#D97706',     // Warning Amber
  },

  // Categorical / Department Analytics Slices (§7.2)
  departments: {
    inpatient: '#5EEAD4',       // Teal tint
    outpatient: '#93C5FD',      // Blue tint
    surgical: '#EC4899',        // Pink
    emergency: '#F43F5E',       // Rose
    icu: '#818CF8',             // Indigo
    lab: '#80DEEA',             // Cyan tint
    pharmacy: '#64748B',        // Slate
  },

  // Pie chart categorical array (§7.2)
  pie: [
    '#5EEAD4', // Inpatient Ward (Teal tint)
    '#93C5FD', // Outpatient Clinic (Blue tint)
    '#EC4899', // Surgical Suite (Pink)
    '#F43F5E', // Emergency Dept (Rose)
    '#818CF8', // ICU (Indigo)
    '#80DEEA', // Laboratory & Radiology (Cyan tint)
    '#64748B', // Pharmacy Dispensary (Slate)
  ],

  // Gradient Series pairs
  emerald: ['#16A34A', '#0D9488'],
  blue: ['#2563EB', '#1D4ED8'],
  purple: ['#818CF8', '#6366F1'],
  rose: ['#F43F5E', '#DC2626'],
  amber: ['#D97706', '#B45309'],
  cyan: ['#26C6DA', '#1AA8BB'],

  // Chart Chrome (§7.3)
  chrome: {
    gridLight: '#C2DFE3',
    gridDark: '#435059',
    axisTextLight: '#7B8E98',
    axisTextDark: '#AACBD3',
    tooltipBgLight: '#FFFFFF',
    tooltipBgDark: '#303B41',
    tooltipBorderLight: '#AACBD3',
    tooltipBorderDark: '#5C6B73',
    tooltipTextLight: '#253237',
    tooltipTextDark: '#F3FBFC',
  },

  // Default shortcuts for charts
  grid: '#AACBD3',
  axisText: '#7B8E98',
  tooltipBackground: '#FFFFFF',
  tooltipBorder: '#AACBD3',
  tooltipText: '#253237',
} as const;
