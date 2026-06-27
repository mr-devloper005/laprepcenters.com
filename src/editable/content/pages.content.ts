import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Premium stories, images, and profiles',
      description: 'Discover editorial stories, image-led features, business profiles, and curated resources in one polished experience.',
      openGraphTitle: 'Premium stories, images, and profiles',
      openGraphDescription: 'A premium public-facing experience for visual discovery, business profiles, articles, and downloadable resources.',
      keywords: ['editorial platform', 'image discovery', 'business profiles', 'content archive'],
    },
    hero: {
      badge: 'Connected platform',
      title: ['Making visual discovery,', 'trusted profiles, and stories feel premium.'],
      description:
        'Browse feature stories, profile-led highlights, and image-first collections through a polished publishing surface built for confident exploration.',
      primaryCta: { label: 'Learn more about the platform', href: '/article' },
      secondaryCta: { label: 'Browse image highlights', href: '/image' },
      searchPlaceholder: 'Search stories, profiles, listings, and resources',
      focusLabel: 'Focus',
      featureCardBadge: 'featured rotation',
      featureCardTitle: 'Fresh posts anchor the front page with stronger hierarchy and motion.',
      featureCardDescription: 'The homepage adapts to live content while maintaining a stable premium editorial layout.',
    },
    intro: {
      badge: 'Introducing',
      title: 'A modern publishing surface for images, profiles, discovery, and long-form content.',
      paragraphs: [
        'The site brings article-style reading, image-led storytelling, and practical directory content into one connected visual system.',
        'Each surface is designed to feel useful and polished on its own while still making it easy to move between content types.',
        'Visitors can start with a feature story, a profile card, a visual collection, or a resource archive and keep exploring naturally.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Image-first hero presentation with premium editorial spacing.',
        'Profile and directory-style cards for credibility and scanning.',
        'Archive and detail surfaces that stay responsive and content-safe.',
        'Stronger white-space rhythm, contrast, and polish across mobile and desktop.',
      ],
      primaryLink: { label: 'Explore articles', href: '/article' },
      secondaryLink: { label: 'View image posts', href: '/image' },
    },
    cta: {
      badge: 'Ready to get started?',
      title: 'Explore stories, images, and profiles through one refined platform.',
      description:
        'Move between articles, image-led posts, profiles, listings, and resources through a unified layout built for browsing and trust.',
      primaryCta: { label: 'Browse Articles', href: '/article' },
      secondaryCta: { label: 'Contact Us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About the platform',
    title: 'A clearer, more premium way to explore public content.',
    description: `${slot4BrandConfig.siteName} is designed to make stories, profiles, visual posts, and supporting resources feel connected and credible.`,
    paragraphs: [
      'The experience focuses on discovery, clarity, and stronger visual trust across every route.',
      'Visitors can move between articles, profiles, images, listings, and resources without losing context or momentum.',
    ],
    values: [
      {
        title: 'Premium presentation',
        description: 'Pages are structured to feel intentional, readable, and useful across desktop and mobile.',
      },
      {
        title: 'Connected discovery',
        description: 'Different content types remain easy to browse together through shared navigation and visual consistency.',
      },
      {
        title: 'Trust and clarity',
        description: 'Strong hierarchy, visible metadata, and cleaner layouts help people find the right content faster.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Reach out through a page that feels like part of the product.',
    description: 'Share what you are looking for, what you want to publish, or where you need help, and the request can be reviewed more clearly.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search posts, topics, categories, and public content across the site.',
    },
    hero: {
      badge: 'Search the platform',
      title: 'Find stories, profiles, images, and resources faster.',
      description: 'Use keywords, categories, and content types to browse the full published surface with less friction.',
      placeholder: 'Search by keyword, topic, title, or category',
    },
    resultsTitle: 'Searchable content',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to open the publishing workspace.',
      description: 'Use your account to create posts for the active sections of this site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content for every active section.',
      description: 'Choose the content type, add details, and prepare a polished post with images, links, summary, and body content.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing workspace.',
      description: 'Login to continue browsing, managing submissions, and creating new content from your account.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the publishing workspace, save details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
