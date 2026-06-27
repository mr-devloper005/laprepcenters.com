import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Premium discovery and publishing',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Premium discovery and publishing',
    primaryLinks: [
      { label: 'Articles', href: '/articles' },
      { label: 'Resources', href: '/pdf' },
      { label: 'Listings', href: '/listings' },
    ],
    actions: {
      primary: { label: 'Explore now', href: '/' },
      secondary: { label: 'Contact', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Articles, visuals, profiles, and curated resources',
    description:
      'A polished public-facing platform for image-led discovery, business profiles, editorial stories, and useful reference pages.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Articles', href: '/articles' },
          { label: 'Business Listings', href: '/listings' },
          { label: 'Document Library', href: '/pdf' },
        ],
      },
      {
        title: 'More',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Social Bookmarks', href: '/sbm' },
        ],
      },
    ],
    bottomNote: 'Designed for confident discovery, credible presentation, and clean navigation.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
