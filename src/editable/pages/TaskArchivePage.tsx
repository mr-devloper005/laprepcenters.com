import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const placeholder = '/placeholder.svg?height=900&width=1200'

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const single = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...single].filter(Boolean).slice(0, 8)
}

const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body) || 'Explore this entry.')
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskGrid: Record<TaskKey, string> = {
  article: 'grid gap-6 lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1.18fr_0.82fr]',
  listing: 'grid gap-5 xl:grid-cols-2',
  classified: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  image: 'columns-1 gap-5 [column-fill:_balance] sm:columns-2 xl:columns-3',
  sbm: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  pdf: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3',
  profile: 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

const cardBase = 'group block rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_18px_50px_rgba(18,45,108,0.08)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_70px_rgba(18,45,108,0.14)]'

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const lead = posts[0]

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="relative overflow-hidden bg-[linear-gradient(90deg,#202d63_0%,#2a5ebb_55%,#8d47c6_100%)] text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(254,236,65,0.12),transparent_18%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.16),transparent_16%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-6 py-16 sm:py-20 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:items-end">
              <div>
                <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-white/72">
                  <span>{voice?.eyebrow || theme.kicker}</span>
                  <span className="h-1 w-1 rounded-full bg-white/50" />
                  <span>{label}</span>
                </div>
                <h1 className="editable-display mt-6 max-w-4xl text-balance text-[3.4rem] font-semibold leading-[0.92] tracking-[-0.04em] sm:text-6xl">
                  {voice?.headline || `Browse ${label}`}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82">
                  {voice?.description || theme.note}
                </p>
                <div className="mt-8 flex flex-wrap gap-2.5">
                  {(voice?.chips || []).map((chip) => (
                    <span key={chip} className="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/84">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-white/14 bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#feec41]">Archive snapshot</p>
                <p className="mt-4 text-4xl font-extrabold text-white">{posts.length}</p>
                <p className="mt-2 text-sm text-white/74">Published items in this view</p>
                <div className="mt-5 border-t border-white/14 pt-5 text-sm text-white/74">
                  <p><span className="font-semibold text-white">{categoryLabel}</span> selected</p>
                  <p className="mt-1">Page {page} of {pagination.totalPages || 1}</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4 rounded-[1.8rem] border border-white/14 bg-white/10 p-5 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/76">
                Browse curated {label.toLowerCase()} with filters, pagination, and safer content fallbacks.
              </p>
              <form action={basePath} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-12 appearance-none rounded-full border border-white/14 bg-white/12 pl-4 pr-10 text-sm font-semibold text-white outline-none transition focus:border-white/24"
                    aria-label={voice?.filterLabel || 'Filter category'}
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
                </div>
                <button className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-sm font-bold uppercase tracking-[0.12em] text-[#1d2d66] transition hover:bg-white/90">
                  Apply
                </button>
              </form>
            </div>
          </div>

          <div className="pointer-events-none relative h-14 overflow-hidden">
            <div className="absolute inset-x-[-5%] bottom-[-44px] h-24 rounded-[100%] bg-[var(--tk-bg)]" />
          </div>
        </header>

        {lead ? (
          <section className="mx-auto max-w-[var(--editable-container)] px-6 py-10 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
              <Link href={`${basePath}/${lead.slug}`} className={`${cardBase} overflow-hidden bg-[var(--slot4-dark-bg)] text-white`}>
                <div className="relative min-h-[420px] overflow-hidden p-8">
                  <img src={getImage(lead)} alt={lead.title} className="absolute inset-0 h-full w-full object-cover opacity-40" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,49,0.18),rgba(8,17,49,0.88))]" />
                  <div className="relative z-10 flex h-full flex-col justify-end">
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#feec41]">
                      Featured {label.slice(0, -1) || label}
                    </p>
                    <h2 className="editable-display mt-4 text-5xl font-semibold leading-[0.94] tracking-[-0.04em]">
                      {lead.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-white/76">
                      {getSummary(lead)}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-white">
                      Open feature <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>

              <div className="grid gap-4">
                {posts.slice(1, 4).map((post, index) => (
                  <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className={`${cardBase} p-5`}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-sm font-bold text-[var(--tk-accent)]">
                        {index + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--tk-accent)]">
                          {getCategory(post, label)}
                        </p>
                        <h3 className="mt-2 text-2xl font-extrabold leading-tight text-[var(--tk-text)]">
                          {post.title}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--tk-muted)]">
                          {getSummary(post)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-[var(--editable-container)] px-6 pb-16 pt-6 lg:px-8">
          {posts.length ? (
            <div className={taskGrid[task]}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="mx-auto max-w-xl rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-white px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-3xl font-semibold tracking-[-0.03em]">Nothing here yet</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--tk-muted)]">
                Try another category, or check back after new {label.toLowerCase()} are published.
              </p>
            </div>
          )}

          {posts.length ? (
            <nav className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-3 font-semibold transition hover:border-[var(--tk-accent)]">Previous</Link> : null}
              <span className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-3 font-semibold text-[var(--tk-muted)]">Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] bg-white px-5 py-3 font-semibold transition hover:border-[var(--tk-accent)]">Next</Link> : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}`
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        <img src={getImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="p-6 sm:p-7">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--tk-accent)]">
          <span>{getCategory(post, 'Article')}</span>
          <span className="text-[var(--tk-muted)]">No. {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editable-display mt-3 text-4xl font-semibold leading-[0.94] tracking-[-0.04em] text-[var(--tk-text)]">
          {post.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-[15px] leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[var(--tk-accent)]">
          Read article <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} flex items-center gap-5 p-5 sm:p-6`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.2rem] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-9 w-9 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="editable-display truncate text-3xl font-semibold tracking-[-0.03em]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold text-[var(--tk-muted)]">
          {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}</span> : null}
          {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}</span> : null}
          {website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> Website</span> : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--tk-muted)] transition group-hover:text-[var(--tk-accent)]" />
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <span className="editable-display text-4xl font-semibold tracking-[-0.03em] text-[var(--tk-accent)]">{price || 'Open offer'}</span>
        {condition ? <span className="rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--tk-accent)]">{condition}</span> : null}
      </div>
      <h2 className="editable-display mt-5 text-3xl font-semibold leading-[0.98] tracking-[-0.03em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <div className="mt-6 flex items-center justify-between border-t border-[var(--tk-line)] pt-4 text-xs font-semibold text-[var(--tk-muted)]">
        <span>{location || 'Details inside'}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--tk-accent)] transition group-hover:translate-x-0.5" />
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_18px_50px_rgba(18,45,108,0.08)] transition duration-300 hover:-translate-y-1">
      <div className={`relative overflow-hidden ${index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={getImage(post)} alt={post.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(10,18,49,0.82))]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#feec41]">{getCategory(post, 'Image')}</p>
          <h2 className="editable-display mt-2 line-clamp-2 text-2xl font-semibold leading-[0.96] tracking-[-0.03em] text-white">{post.title}</h2>
        </div>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} flex gap-4 p-6`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
        <Globe className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--tk-muted)]">Saved {String(index + 1).padStart(2, '0')}</span>
        <h2 className="editable-display mt-1.5 text-2xl font-semibold leading-[0.98] tracking-[-0.03em]">{post.title}</h2>
        <p className="mt-2 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        {website ? <p className="mt-3 truncate text-xs font-bold uppercase tracking-[0.14em] text-[var(--tk-accent)]">{website.replace(/^https?:\/\//, '').replace(/\/$/, '')}</p> : null}
      </div>
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className={`${cardBase} flex flex-col p-6 sm:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><FileText className="h-6 w-6" /></div>
        <span className="rounded-full border border-[var(--tk-line)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--tk-muted)]">{getCategory(post, 'Document')}</span>
      </div>
      <h2 className="editable-display mt-6 text-3xl font-semibold leading-[0.98] tracking-[-0.03em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.12em] text-[var(--tk-accent)]">Open document <Download className="h-4 w-4" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} flex flex-col items-center p-7 text-center`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {avatar ? <img src={avatar} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-[var(--tk-muted)]" />}
      </div>
      <h2 className="editable-display mt-5 text-2xl font-semibold tracking-[-0.03em]">{post.title}</h2>
      {role ? <p className="mt-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">{role}</p> : null}
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
    </Link>
  )
}
