'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const hiddenFooterRoutes = new Set(['/image', '/images', '/image-sharing', '/profile', '/profiles'])

export function EditableFooter() {
  const year = new Date().getFullYear()
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled && !hiddenFooterRoutes.has(task.route))
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-auto overflow-hidden bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="h-[2px] bg-[linear-gradient(90deg,var(--slot4-accent-fill),#5f88ff 40%,#9247c9 75%,var(--slot4-accent))]" />
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr_0.9fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/14 bg-white/8">
                <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
              </span>
              <span>
                <span className="editable-display block text-[2rem] font-semibold leading-none text-white">
                  {SITE_CONFIG.name}
                </span>
                <span className="mt-1 block text-xs uppercase tracking-[0.28em] text-white/48">
                  {globalContent.footer.tagline}
                </span>
              </span>
            </Link>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/68">
              {globalContent.footer.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-white">Explore</h3>
            <div className="mt-5 grid gap-3">
              {taskLinks.slice(0, 6).map((task) => (
                <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm text-white/72 transition hover:text-white">
                  {task.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.24em] text-white">Site</h3>
            <div className="mt-5 grid gap-3">
              <Link href="/about" className="text-sm text-white/72 transition hover:text-white">About</Link>
              <Link href="/contact" className="text-sm text-white/72 transition hover:text-white">Contact</Link>
              {session ? (
                <>
                  <Link href="/create" className="text-sm text-white/72 transition hover:text-white">Create</Link>
                  <button type="button" onClick={logout} className="text-left text-sm text-white/72 transition hover:text-white">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm text-white/72 transition hover:text-white">Login</Link>
                  <Link href="/signup" className="text-sm text-white/72 transition hover:text-white">Sign up</Link>
                </>
              )}
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/6 p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#feec41]">Platform note</p>
            <h3 className="editable-display mt-3 text-3xl font-semibold leading-none text-white">
              Discover with more confidence.
            </h3>
            <p className="mt-4 text-sm leading-7 text-white/68">
              Browse images, profiles, stories, and resources through a cleaner visual system designed to feel polished on every route.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-white/48">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>{globalContent.footer.bottomNote}</p>
            <p>Copyright {year} {SITE_CONFIG.name}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
