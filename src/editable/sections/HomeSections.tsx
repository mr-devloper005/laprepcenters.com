import Link from 'next/link'
import {
  ArrowRight, ChevronRight, Globe2, Search, ShieldCheck, Sparkles,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import {
  ArticleListCard,
  CompactIndexCard,
  EditorialFeatureCard,
  RailPostCard,
  getEditablePostImage,
  postHref,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

function dedupePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.slug || post.id || post.title, post])).values())
}

function getPool(posts: SitePost[], timeSections: HomeTimeSection[]) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

function HeroVisual({ posts }: { posts: SitePost[] }) {
  const images = posts.map((post) => getEditablePostImage(post)).slice(0, 5)
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.26),transparent_68%)] blur-3xl" />
      <div className="relative grid gap-4 sm:grid-cols-[0.62fr_1fr]">
        <div className="grid gap-4">
          {images.slice(0, 2).map((image, index) => (
            <div key={`${image}-${index}`} className="overflow-hidden rounded-[2rem] border border-white/16 bg-white/10 shadow-[0_24px_60px_rgba(4,16,56,0.26)]">
              <img src={image} alt="" className="aspect-[4/5] w-full object-cover" />
            </div>
          ))}
        </div>
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-[2.2rem] border border-white/16 bg-white/10 shadow-[0_24px_60px_rgba(4,16,56,0.26)]">
            <img src={images[2] || images[0] || '/placeholder.svg?height=1200&width=900'} alt="" className="aspect-[16/11] w-full object-cover" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {images.slice(3, 5).map((image, index) => (
              <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.8rem] border border-white/16 bg-white/10 shadow-[0_24px_60px_rgba(4,16,56,0.26)]">
                <img src={image} alt="" className="aspect-[4/3] w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function EditableHomeHero({ posts, timeSections }: HomeSectionProps) {
  const pool = getPool(posts, timeSections)
  const title = pagesContent.home.hero.title.join(' ')

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(90deg,#1e2d69_0%,#2e62c6_54%,#9940bb_100%)] text-white">
      <div className="absolute inset-x-0 top-0 h-full bg-[radial-gradient(circle_at_25%_25%,rgba(254,236,65,0.14),transparent_18%),radial-gradient(circle_at_75%_15%,rgba(255,255,255,0.16),transparent_14%)]" />
      <div className={`relative grid gap-12 py-12 sm:py-16 lg:grid-cols-[0.98fr_1.02fr] lg:items-center lg:py-20 ${container}`}>
        <div className="max-w-[620px]">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-white/72">
            {pagesContent.home.hero.badge}
          </p>
          <h1 className="editable-display mt-6 text-balance text-5xl font-semibold leading-[0.9] tracking-[-0.05em] sm:text-6xl lg:text-[6rem]">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-white/82">
            {pagesContent.home.hero.description}
          </p>

          <form action="/search" className="mt-10 flex w-full max-w-[560px] overflow-hidden rounded-full border border-white/12 bg-white/12 shadow-[0_20px_48px_rgba(10,19,53,0.25)] backdrop-blur">
            <div className="flex flex-1 items-center gap-3 px-5">
              <Search className="h-5 w-5 shrink-0 text-[#feec41]" />
              <input
                name="q"
                placeholder={pagesContent.home.hero.searchPlaceholder}
                className="w-full bg-transparent py-4 text-sm text-white outline-none placeholder:text-white/54"
              />
            </div>
            <button className="shrink-0 bg-white/18 px-6 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-white/24 sm:px-8">
              Search
            </button>
          </form>

        </div>

        <HeroVisual posts={pool} />
      </div>

      <div className="pointer-events-none relative h-16 overflow-hidden sm:h-20">
        <div className="absolute inset-x-[-5%] bottom-[-52px] h-24 rounded-[100%] bg-[var(--slot4-page-bg)] sm:bottom-[-48px] sm:h-28" />
      </div>
    </section>
  )
}

function IntroCard({ title, text, icon: Icon }: { title: string; text: string; icon: typeof Globe2 }) {
  return (
    <div className="rounded-[1.7rem] bg-white p-6 shadow-[0_22px_60px_rgba(18,45,108,0.08)]">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent-fill)]">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-2xl font-extrabold leading-tight text-[var(--slot4-page-text)]">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">
        {text}
      </p>
    </div>
  )
}

export function EditableStoryRail({ posts, primaryTask, primaryRoute }: HomeSectionProps) {
  const items = posts.slice(0, 5)
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`grid gap-10 py-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start ${container}`}>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--slot4-accent-fill)]">
            {pagesContent.home.intro.badge}
          </p>
          <h2 className="editable-display mt-4 max-w-xl text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-[var(--slot4-page-text)]">
            {pagesContent.home.intro.title}
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-8 text-[var(--slot4-muted-text)]">
            {pagesContent.home.intro.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href={pagesContent.home.intro.primaryLink.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white">
              {pagesContent.home.intro.primaryLink.label}
            </Link>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <IntroCard title="Open visual discovery" text="Image-led content and stories stay prominent instead of disappearing into generic grids." icon={Sparkles} />
          <IntroCard title="Connected publishing" text="Profiles, articles, listings, and resources all benefit from one premium visual system." icon={ShieldCheck} />
          <IntroCard title="Business-ready presentation" text="A strong layout, cleaner spacing, and polished cards help public content feel more credible." icon={Globe2} />
        </div>
      </div>

      {items.length ? (
        <div className={`pb-16 ${container}`}>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <EditorialFeatureCard post={items[0]} href={postHref(primaryTask, items[0], primaryRoute)} label="Featured story" />
            <div className="grid gap-4">
              {items.slice(1, 4).map((post, index) => (
                <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index + 1} />
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = getPool(posts, timeSections)
  const listing = pool.slice(0, 4)

  return (
    <>
      {listing.length ? (
        <section className="bg-[var(--slot4-warm)]">
          <div className={`py-16 sm:py-20 ${container}`}>
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--slot4-accent-fill)]">
                  Connected solutions
                </p>
                <h2 className="editable-display mt-4 text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-[var(--slot4-page-text)]">
                  Premium content cards arranged with more variety.
                </h2>
                <p className="mt-6 text-lg leading-8 text-[var(--slot4-muted-text)]">
                  The archive mixes feature cards, list cards, compact cards, horizontal cards, and image-first cards so the site does not collapse into one repeated block pattern.
                </p>
              </div>
              <div className="grid gap-5">
                {listing.map((post, index) => (
                  <ArticleListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

function sectionCopy(key: string) {
  if (key === 'spotlight') return { eyebrow: 'Featured news', title: 'Fresh picks from the current feed' }
  if (key === 'browse') return { eyebrow: 'Browse more', title: 'Popular across the platform' }
  return { eyebrow: 'Archive view', title: 'More to explore' }
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const fallback = [
    { key: 'spotlight', posts: posts.slice(0, 6), href: primaryRoute },
    { key: 'browse', posts: posts.slice(6, 12), href: primaryRoute },
    { key: 'index', posts: posts.slice(12, 18), href: primaryRoute },
  ]
  const sections = (timeSections.length ? timeSections : fallback).filter((section) => section.posts.length)
  if (!sections.length) return null

  return (
    <>
      {sections.map((section, sectionIndex) => (
        <section key={section.key} className={sectionIndex % 2 === 0 ? 'bg-white' : 'bg-[var(--slot4-page-bg)]'}>
          <div className={`py-16 sm:py-20 ${container}`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent-fill)]">
                  {sectionCopy(section.key).eyebrow}
                </p>
                <h2 className="editable-display mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-[var(--slot4-page-text)] sm:text-5xl">
                  {sectionCopy(section.key).title}
                </h2>
              </div>
              <Link href={section.href || primaryRoute} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--slot4-accent-fill)]">
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10">
              {sectionIndex === 0 ? (
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                  {section.posts.slice(0, 4).map((post, index) => (
                    <RailPostCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                  ))}
                </div>
              ) : sectionIndex === 1 ? (
                <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                  {section.posts[0] ? (
                    <EditorialFeatureCard post={section.posts[0]} href={postHref(primaryTask, section.posts[0], primaryRoute)} label="Spotlight feature" />
                  ) : null}
                  <div className="grid gap-4">
                    {section.posts.slice(1, 4).map((post, index) => (
                      <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index + 1} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid gap-5">
                  {section.posts.slice(0, 4).map((post, index) => (
                    <ArticleListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </>
  )
}

export function EditableHomeCta() {
  const tasks = SITE_CONFIG.tasks
    .filter((task) => task.enabled && !['image', 'profile'].includes(task.key))
    .slice(0, 4)
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="rounded-[2.2rem] bg-white p-8 shadow-[0_24px_70px_rgba(18,45,108,0.08)] sm:p-10 lg:p-14">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--slot4-accent-fill)]">
            {pagesContent.home.cta.badge}
          </p>
          <h2 className="editable-display mt-4 max-w-3xl text-5xl font-semibold leading-[0.92] tracking-[-0.04em] text-[var(--slot4-page-text)]">
            {pagesContent.home.cta.title}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--slot4-muted-text)]">
            {pagesContent.home.cta.description}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tasks.map((task) => (
              <Link key={task.key} href={task.route} className="rounded-[1.5rem] bg-[var(--slot4-lavender)] px-6 py-5 text-left transition hover:-translate-y-1">
                <h3 className="text-2xl font-extrabold text-[var(--slot4-page-text)]">{task.label}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">
                  Explore the latest {task.label.toLowerCase()} with the same premium visual system.
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={pagesContent.home.cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white">
              {pagesContent.home.cta.primaryCta.label}
            </Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-[var(--slot4-page-text)]">
              {pagesContent.home.cta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
