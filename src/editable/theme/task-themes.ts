import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY = "'Cormorant Garamond', Georgia, serif"
const BODY = "'Manrope', system-ui, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY,
  fontBody: BODY,
  bg: '#fff8f9',
  surface: '#ffffff',
  raised: '#fff1f4',
  text: '#760031',
  muted: '#9a4661',
  line: 'rgba(213,28,57,0.14)',
  accent: '#d51c39',
  accentSoft: 'rgba(255,96,96,0.12)',
  onAccent: '#ffffff',
  glow: 'rgba(254,236,65,0.18)',
  radius: '1.6rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Editorial Desk', note: 'Long-form reading with generous space, richer imagery, and a composed premium rhythm.' },
  listing: { ...base, kicker: 'Directory View', note: 'Compare businesses quickly with clear trust markers, contact cues, and profile-led cards.' },
  classified: { ...base, kicker: 'Offers Board', note: 'Fast-scan marketplace entries with pricing, urgency, and direct action paths.' },
  image: { ...base, kicker: 'Visual Gallery', note: 'Image-led browsing with a polished gallery flow and bold art direction.' },
  sbm: { ...base, kicker: 'Resource Shelf', note: 'Useful links arranged like an organized library instead of a plain feed.' },
  pdf: { ...base, kicker: 'Document Archive', note: 'Reports, downloads, and references presented with clean library cues.' },
  profile: { ...base, kicker: 'People Index', note: 'Profiles that feel credible, well framed, and easy to explore.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
