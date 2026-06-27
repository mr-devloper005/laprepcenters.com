import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Editorial collection',
    headline: 'Feature stories and long-form reads with a premium editorial rhythm.',
    description: 'The archive should feel like a polished publication with strong image cards, clear hierarchy, and generous reading space.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Reading surfaces need hierarchy, focus, and visual confidence.',
    chips: ['Feature stories', 'Editorial grid', 'Long-read friendly'],
  },
  classified: {
    eyebrow: 'Marketplace board',
    headline: 'Offers and listings arranged for fast scanning and quick action.',
    description: 'Classified content should surface price, condition, and urgency without losing polish.',
    filterLabel: 'Filter classified category',
    secondaryNote: 'Keep value, urgency, and action paths easy to spot.',
    chips: ['Fast scan', 'Price forward', 'Action cues'],
  },
  sbm: {
    eyebrow: 'Curated links',
    headline: 'Useful resources presented like an organized premium shelf.',
    description: 'Bookmark pages should feel curated, practical, and easy to browse without turning into plain text lists.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Utility content still benefits from hierarchy and polish.',
    chips: ['Curated', 'Reference ready', 'Useful links'],
  },
  profile: {
    eyebrow: 'People and brands',
    headline: 'Profile pages that foreground identity, trust, and discoverability.',
    description: 'Profiles should feel credible and image-aware instead of buried inside a generic feed.',
    filterLabel: 'Filter profile category',
    secondaryNote: 'Lead with identity, then support it with context and related items.',
    chips: ['Identity first', 'Trust cues', 'Profile cards'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'Reports, guides, and files organized like a polished archive.',
    description: 'Document pages should feel structured, useful, and easy to return to later.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Document surfaces need file context and archive clarity.',
    chips: ['Documents', 'Guides', 'Archive layout'],
  },
  listing: {
    eyebrow: 'Business directory',
    headline: 'Business and service listings arranged for discovery and comparison.',
    description: 'Listing pages should balance profile credibility with quick contact and location cues.',
    filterLabel: 'Filter business category',
    secondaryNote: 'Trust markers and practical metadata should stay visible.',
    chips: ['Directory style', 'Contact cues', 'Compare quickly'],
  },
  image: {
    eyebrow: 'Visual showcase',
    headline: 'Image posts with a gallery-forward discovery experience.',
    description: 'Image pages should let visuals lead while preserving enough structure to keep browsing smooth.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let the image do the work before long text does.',
    chips: ['Gallery flow', 'Image first', 'Visual discovery'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
