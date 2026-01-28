import { getSession } from "@/lib/session";
import Link from "next/link";

export default async function Header() {

  const session = await getSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container flex h-14 items-center pl-10 mx-auto">
        <div className="mr-4 flex flex-1 w-full">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold inline-block text-indigo-600 text-xl">
              EduPlus
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {session ? (
              <>
                <Link
                  href="/portal"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Dashboard
                </Link>
                {session.role === 1 && (
                  <>
                    <Link
                      href="/portal/users"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      Users
                    </Link>
                    <Link
                      href="/portal/instructors"
                      className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                      Instructors
                    </Link>
                  </>
                )}
                <Link
                  href="/portal/courses"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Courses
                </Link>
                {(session.role === 0 || session.role === 2) && (
                  <Link
                    href="/portal/announcements"
                    className="transition-colors hover:text-foreground/80 text-foreground/60"
                  >
                    Announcements
                  </Link>
                )}
                <Link
                  href="/portal/messages"
                  className="transition-colors hover:text-foreground/80 text-foreground/60"
                >
                  Messages
                </Link>
              </>
            ) : (
              <Link
                href="/courses"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Courses
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center gap-2 pr-10">
            {!session ? (
              <Link
                href="/auth/login"
                className="inline-flex h-9 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Login
              </Link>
            ):(
              <Link
                  href="/profile"
                  className="inline-flex items-center justify-center rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                  title="My Profile"
              >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
