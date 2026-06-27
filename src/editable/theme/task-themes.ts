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
  bg: '#f5f7ff',
  surface: '#ffffff',
  raised: '#edf3ff',
  text: '#16244f',
  muted: '#5d6e9f',
  line: 'rgba(27,63,131,0.12)',
  accent: '#0f78db',
  accentSoft: 'rgba(15,120,219,0.1)',
  onAccent: '#ffffff',
  glow: 'rgba(118,0,49,0.12)',
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
