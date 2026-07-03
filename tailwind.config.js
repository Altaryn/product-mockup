/**
 * Tailwind config — Sentry design system tokens (DESIGN-sentry.md).
 * Raw brand tokens are literal hex; theme-aware semantic tokens read CSS vars
 * (see src/index.css) so a single class works across the light/dark polarities.
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // --- Raw brand & accent tokens (fixed hex) ---
        primary: '#150f23', // midnight violet — strongest action / deepest surface
        'ink-deep': '#1f1633',
        ink: '#1f1633',
        'ink-press': '#1a1a1a',
        'on-primary': '#ffffff',
        lime: '#c2ef4e', // signature — keyword chips only, keep scarce
        pink: '#fa7faa', // secondary punctuation / chart points
        violet: {
          DEFAULT: '#6a5fc1',
          deep: '#422082',
          mid: '#79628c',
        },
        night: '#150f23',
        'canvas-dark': '#1f1633',
        'press-light': '#f0f0f0',
        'press-strong': '#efefef',
        'hairline-violet': '#362d59',
        'hairline-cool': '#cfcfdb',
        'hairline-cloud': '#e5e7eb',
        'on-dark-muted': '#bdb8c0',
        'on-dark-faint': '#3f3849',
        'ring-focus': '#9dc1f5',

        // --- Semantic, theme-aware (CSS vars: `R G B` channels) ---
        'app-bg': 'rgb(var(--app-bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        'surface-3': 'rgb(var(--surface-3) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        'content-muted': 'rgb(var(--content-muted) / <alpha-value>)',
        'content-faint': 'rgb(var(--content-faint) / <alpha-value>)',
        hairline: 'rgb(var(--hairline) / <alpha-value>)',
        'hairline-strong': 'rgb(var(--hairline-strong) / <alpha-value>)',
        'btn-primary': 'rgb(var(--btn-primary-bg) / <alpha-value>)',
        'btn-primary-fg': 'rgb(var(--btn-primary-fg) / <alpha-value>)',
      },
      fontFamily: {
        // Space Grotesk substitutes the proprietary Sentry Display (see DESIGN §Font Substitutes)
        display: ['"Space Grotesk"', 'Rubik', 'system-ui', 'sans-serif'],
        sans: ['Rubik', '-apple-system', 'system-ui', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['Monaco', 'Menlo', '"Ubuntu Mono"', 'monospace'],
      },
      // Escala compacta para B2B denso en laptops (reducida ~12–20% del scale Sentry).
      fontSize: {
        'display-lg': ['46px', { lineHeight: '1.05', fontWeight: '500' }],
        'heading-xl': ['24px', { lineHeight: '1.2', fontWeight: '500' }],
        'heading-lg': ['21px', { lineHeight: '1.25', fontWeight: '500' }],
        'heading-md': ['19px', { lineHeight: '1.25', fontWeight: '500' }],
        'heading-sm': ['16px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-lg': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-strong': ['14px', { lineHeight: '1.5', fontWeight: '600' }],
        'body-md': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        eyebrow: ['13px', { lineHeight: '1.4', fontWeight: '500' }],
        'button-cap': ['13px', { lineHeight: '1.15', letterSpacing: '0.2px', fontWeight: '700' }],
        'button-cap-light': ['13px', { lineHeight: '1.29', letterSpacing: '0.2px', fontWeight: '500' }],
        caption: ['13px', { lineHeight: '1.45', fontWeight: '400' }],
        'micro-cap': ['10px', { lineHeight: '1.7', letterSpacing: '0.25px', fontWeight: '600' }],
        code: ['13px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        xxl: '18px',
      },
      spacing: {
        section: '96px',
      },
      maxWidth: {
        container: '1152px',
      },
      boxShadow: {
        e1: 'rgba(0,0,0,0.08) 0 2px 8px 0',
        e2: 'rgba(0,0,0,0.1) 0 10px 15px -3px, rgba(0,0,0,0.1) 0 4px 6px -4px',
        e3: 'rgb(21,15,35) 0 0 8px 6px', // dark hero glow halo
        e4: 'rgba(0,0,0,0.18) 0 0.5rem 1.5rem',
      },
      ringColor: {
        focus: '#9dc1f5',
      },
    },
  },
  plugins: [],
}
