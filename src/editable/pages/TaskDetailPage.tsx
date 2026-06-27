import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Bookmark, Building2, Camera, Download, ExternalLink, FileText, Globe2, Mail, MapPin, Phone, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'
const linkifyMarkdown = (value: string) => value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) => linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})
const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))
const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const leadText = (post: SitePost) => {
  const lead = stripHtml(summaryText(post))
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function HeroHeader({ task, post, category, image }: { task: TaskKey; post: SitePost; category: string; image?: string }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(90deg,#202d63_0%,#2a5ebb_55%,#8d47c6_100%)] text-white">
      {image ? <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-18" /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,49,0.72),rgba(8,17,49,0.68))]" />
      <div className="relative mx-auto max-w-[var(--editable-container)] px-6 py-14 sm:py-20 lg:px-8">
        <BackLink task={task} />
        <p className="mt-10 text-[11px] font-bold uppercase tracking-[0.3em] text-[#feec41]">{category}</p>
        <h1 className="editable-display mt-5 max-w-4xl text-balance text-5xl font-semibold leading-[0.92] tracking-[-0.05em] sm:text-6xl">
          {post.title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-white/82">
          {leadText(post) || 'Explore the details, supporting media, and related entries below.'}
        </p>
      </div>
      <div className="pointer-events-none relative h-14 overflow-hidden">
        <div className="absolute inset-x-[-5%] bottom-[-44px] h-24 rounded-[100%] bg-[var(--tk-bg)]" />
      </div>
    </section>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <HeroHeader task="article" post={post} category={categoryOf(post, 'Article')} image={images[0]} />
      <article className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
        {images[0] ? <img src={images[0]} alt={post.title} className="aspect-[16/9] w-full rounded-[1.9rem] border border-[var(--tk-line)] object-cover shadow-[0_24px_64px_rgba(18,45,108,0.12)]" /> : null}
        <BodyContent post={post} />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <HeroHeader task="listing" post={post} category={categoryOf(post, 'Business listing')} image={logo} />
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-10 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-7 shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[1.6rem] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {logo ? <img src={logo} alt={post.title} className="h-full w-full object-cover" /> : <Building2 className="h-12 w-12 text-[var(--tk-muted)]" />}
              </div>
              <div>
                <h2 className="editable-display text-4xl font-semibold tracking-[-0.04em]">{post.title}</h2>
                <p className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">{address || 'Directory entry'}</p>
              </div>
            </div>
            <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>
          <aside className="space-y-6">
            <ContactAction website={website} phone={phone} email={email} />
            <RelatedPanel task="listing" related={related} />
          </aside>
        </div>
      </section>
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <HeroHeader task="classified" post={post} category={categoryOf(post, 'Classified')} image={images[0]} />
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-10 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-7 shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
            <p className="editable-display text-5xl font-semibold tracking-[-0.04em] text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            {condition ? <p className="mt-4 inline-flex rounded-full bg-[var(--tk-accent-soft)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]">{condition}</p> : null}
            {location ? <p className="mt-4 text-sm leading-7 text-[var(--tk-muted)]">{location}</p> : null}
            <div className="mt-7 flex flex-wrap gap-3">
              {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white"><Phone className="h-4 w-4" /> Call</a> : null}
              {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em]"><Mail className="h-4 w-4" /> Email</a> : null}
            </div>
          </aside>
          <article className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-7 shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
            <ImageStrip images={images} label="Listing images" large />
            <BodyContent post={post} />
            <ContactAction website={website} phone={phone} email={email} />
          </article>
        </div>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <HeroHeader task="image" post={post} category={categoryOf(post, 'Image story')} image={gallery[0]} />
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-10 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="columns-1 gap-5 [column-fill:_balance] sm:columns-2">
            {gallery.map((image, index) => (
              <figure key={`${image}-${index}`} className="mb-5 break-inside-avoid overflow-hidden rounded-[1.8rem] border border-[var(--tk-line)] bg-white shadow-[0_16px_42px_rgba(18,45,108,0.08)]">
                <img src={image} alt={post.title} className="w-full object-cover" />
              </figure>
            ))}
          </div>
          <aside className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-7 shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent-soft)] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--tk-accent)]"><Camera className="h-3.5 w-3.5" /> Visual story</div>
            <BodyContent post={post} compact />
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <HeroHeader task="sbm" post={post} category={categoryOf(post, 'Saved resource')} />
      <article className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
        <div className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-8 shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]"><Bookmark className="h-7 w-7" /></div>
          {website ? (
            <Link href={website} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white">
              Open resource <ExternalLink className="h-4 w-4" />
            </Link>
          ) : null}
          <BodyContent post={post} />
        </div>
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <HeroHeader task="pdf" post={post} category={categoryOf(post, 'Document')} />
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-10 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-7 shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
            <BodyContent post={post} />
            {fileUrl ? (
              <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-[var(--tk-line)]">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] bg-[var(--tk-raised)] p-4">
                  <span className="text-sm font-bold uppercase tracking-[0.12em]">Document preview</span>
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">Download <Download className="h-4 w-4" /></Link>
                </div>
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full bg-[var(--tk-raised)]" />
              </div>
            ) : null}
          </article>
          <aside className="space-y-6">
            {fileUrl ? (
              <div className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--tk-accent)]">Get this document</p>
                <p className="mt-3 text-sm leading-7 text-[var(--tk-muted)]">Open or download the full file in a new tab.</p>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white">Download <Download className="h-4 w-4" /></Link>
              </div>
            ) : null}
            <RelatedPanel task="pdf" related={related} />
          </aside>
        </div>
      </section>
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <HeroHeader task="profile" post={post} category={categoryOf(post, 'Profile')} image={images[0]} />
      <section className="mx-auto max-w-[var(--editable-container)] px-6 py-10 sm:py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-8 text-center shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
            <div className="mx-auto flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)]">
              {images[0] ? <img src={images[0]} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[var(--tk-muted)]" />}
            </div>
            <h2 className="editable-display mt-6 text-4xl font-semibold tracking-[-0.04em]">{post.title}</h2>
            {role ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">{role}</p> : null}
            <ContactAction website={website} email={email} bare />
          </aside>
          <article className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-7 shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Gallery" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.4rem] border border-[var(--tk-line)] bg-[var(--tk-raised)] p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--tk-muted)]"><Icon className="h-4 w-4 text-[var(--tk-accent)]" /> {label}</div>
          <p className="mt-2 break-words text-sm font-semibold leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--tk-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.5rem] border border-[var(--tk-line)] object-cover" />)}
      </div>
    </section>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
      {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em]"><Phone className="h-4 w-4" /> Call</a> : null}
      {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-bold uppercase tracking-[0.12em]"><Mail className="h-4 w-4" /> Email</a> : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--tk-accent)]">Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  return (
    <div className="rounded-[1.9rem] border border-[var(--tk-line)] bg-white p-6 shadow-[0_20px_60px_rgba(18,45,108,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="editable-display text-3xl font-semibold tracking-[-0.03em]">More like this</h2>
        <Link href={getTaskConfig(task)?.route || '/'} className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--tk-accent)]">View all</Link>
      </div>
      <div className="mt-5 grid gap-3">
        {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
      </div>
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  return (
    <section className="border-t border-[var(--tk-line)] bg-white">
      <div className="mx-auto max-w-[var(--editable-container)] px-6 py-14 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="editable-display text-4xl font-semibold tracking-[-0.04em]">More to explore</h2>
          <Link href={getTaskConfig(task)?.route || '/'} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.12em] text-[var(--tk-accent)]">View all <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="group block overflow-hidden rounded-[1.6rem] border border-[var(--tk-line)] bg-[var(--tk-surface)] shadow-[0_16px_42px_rgba(18,45,108,0.08)] transition duration-300 hover:-translate-y-1">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          {image ? <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
        </div>
        <div className="p-5">
          <h3 className="editable-display line-clamp-2 text-2xl font-semibold leading-[0.98] tracking-[-0.03em]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-[1.2rem] border border-[var(--tk-line)] p-3 transition hover:border-[var(--tk-accent)]">
      {image ? <img src={image} alt={post.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[var(--tk-raised)]"><FileText className="h-5 w-5 text-[var(--tk-muted)]" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
