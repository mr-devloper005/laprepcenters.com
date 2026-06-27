'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, LogIn, Menu, PlusCircle, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const hiddenNavRoutes = new Set(['/image', '/images', '/image-sharing', '/profile', '/profiles'])

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () =>
      SITE_CONFIG.tasks
        .filter((task) => task.enabled && !hiddenNavRoutes.has(task.route))
        .slice(0, 6)
        .map((task) => ({ label: task.label, href: task.route })),
    []
  )

  const mobileItems = [
    { label: 'Home', href: '/' },
    ...navItems,
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    ...(session ? [{ label: 'Create', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }]),
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)] backdrop-blur-xl">
      <div className="h-[3px] bg-[linear-gradient(90deg,var(--slot4-accent-fill),#4a7fff 45%,#8f46cc 80%,var(--slot4-accent))]" />
      <nav className="mx-auto flex min-h-[92px] w-full max-w-[var(--editable-container)] items-center gap-5 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/8 shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-8 w-8 object-contain" />
          </span>
          <span className="hidden md:block">
            <span className="editable-display block text-[2rem] font-semibold leading-none tracking-[0.01em] text-white">
              {SITE_CONFIG.name}
            </span>
            <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.32em] text-white/60">
              {globalContent.nav?.tagline || SITE_CONFIG.tagline}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2.5 text-[13px] font-bold transition ${
                  active
                    ? 'bg-white/14 text-white'
                    : 'text-white/78 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <form action="/search" className="mx-auto hidden min-w-0 flex-1 justify-center lg:flex">
          <label className="flex w-full max-w-[350px] items-center gap-3 rounded-full border border-white/14 bg-white/8 px-4 py-3 text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition focus-within:border-white/26 focus-within:bg-white/12">
            <Search className="h-4 w-4 shrink-0 text-[var(--slot4-accent-fill)]" />
            <input
              name="q"
              type="search"
              placeholder="Search the platform"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
            />
          </label>
        </form>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link
                href="/create"
                className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--editable-cta-text)] transition hover:brightness-95 sm:inline-flex"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create
              </Link>
              <button
                type="button"
                onClick={logout}
                className="hidden rounded-full border border-white/16 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/70 transition hover:border-white/28 hover:text-white sm:inline-flex"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden items-center gap-2 rounded-full border border-white/14 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/76 transition hover:border-white/26 hover:bg-white/8 sm:inline-flex"
              >
                <LogIn className="h-3.5 w-3.5" /> Login
              </Link>
              <Link
                href="/signup"
                className="hidden items-center gap-2 rounded-full bg-[var(--editable-cta-bg)] px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--editable-cta-text)] transition hover:brightness-95 sm:inline-flex"
              >
                <UserPlus className="h-3.5 w-3.5" /> Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-white/14 bg-white/8 p-3 xl:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[#243160] px-4 py-5 xl:hidden">
          <form action="/search" className="mb-5 flex items-center gap-3 rounded-full border border-white/14 bg-white/8 px-4 py-3">
            <Search className="h-4 w-4 text-[var(--slot4-accent-fill)]" />
            <input
              name="q"
              type="search"
              placeholder="Search the platform"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/45"
            />
          </form>
          <div className="grid gap-2">
            {mobileItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold ${
                    active ? 'bg-white/14 text-white' : 'text-white/78 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </header>
  )
}
