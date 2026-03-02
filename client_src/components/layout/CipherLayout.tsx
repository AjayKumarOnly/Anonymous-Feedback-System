import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShieldQuestion, UserRound, MessageCircleMore } from 'lucide-react'
import { AuthProvider, useAuth } from '../staff/auth-context'
import { GroupProvider } from '../groups/group-context'
import { TopicProvider } from '../topics/topic-context'

const TopNav: React.FC = () => {
  const location = useLocation()
  const { isAuthenticated, logout, user } = useAuth()
  const isTeacherRoute = location.pathname.startsWith('/teacher')

  return (
    <header className="border-b border-stone-700/80 bg-stone-900/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-l-4 border-amber-500 bg-stone-800 text-amber-400">
            <ShieldQuestion className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-stone-100">
              CipherFeedback
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-500/90">
              Anonymous feedback
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 text-xs font-medium">
          {!isAuthenticated && (
            <>
              {!isTeacherRoute ? (
                <Link
                  to="/teacher/login"
                  className="inline-flex items-center gap-1.5 rounded-md border border-stone-600 bg-stone-800 px-3 py-1.5 text-stone-200 transition hover:border-amber-500/50 hover:bg-stone-700 hover:text-amber-400"
                >
                  <UserRound className="h-3.5 w-3.5" />
                  Teacher
                </Link>
              ) : (
                <Link
                  to="/student/login"
                  className="inline-flex items-center gap-1.5 rounded-md border border-stone-600 bg-stone-800 px-3 py-1.5 text-stone-200 transition hover:border-emerald-500/50 hover:bg-stone-700 hover:text-emerald-400"
                >
                  <UserRound className="h-3.5 w-3.5" />
                  Student
                </Link>
              )}
            </>
          )}

          {isAuthenticated && user && (
            <>
              <Link
                to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'}
                className="inline-flex items-center gap-1.5 rounded-md border border-stone-600 bg-stone-800 px-3 py-1.5 text-stone-200 transition hover:border-stone-500 hover:bg-stone-700 hover:text-stone-300"
              >
                <MessageCircleMore className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-md border border-stone-600 bg-stone-800 px-3 py-1.5 text-stone-400 transition hover:border-red-500/50 hover:bg-stone-700 hover:text-red-400"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export const CipherLayout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <AuthProvider>
      <GroupProvider>
        <TopicProvider>
          <div className="min-h-screen bg-stone-950 text-stone-100">
            <TopNav />
            <main className="mx-auto max-w-5xl flex-1 px-4 py-8">{children}</main>
          </div>
        </TopicProvider>
      </GroupProvider>
    </AuthProvider>
  )
}
