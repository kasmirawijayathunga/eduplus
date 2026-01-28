import Link from "next/link"
import db from "@/config/db"
import { getUser } from "@/lib/dal"

export default async function DashboardPage() {
  const user = await getUser()
  if (!user) return null

  const [courseCount, submissionCount, announcementCount, recentSubmissions] = await Promise.all([
    db.course.count({ where: { instructorId: user.id } }),
    db.submission.count({ 
      where: { 
        assignment: { course: { instructorId: user.id } },
        status: 'SUBMITTED'
      } 
    }),
    db.announcement.count({ where: { course: { instructorId: user.id } } }),
    db.submission.findMany({
      where: {
        assignment: { course: { instructorId: user.id } },
        status: 'SUBMITTED'
      },
      include: {
        assignment: true,
        student: true
      },
      orderBy: { submittedAt: 'desc' },
      take: 5
    })
  ])

  return (
    <div className="container flex w-full flex-col mx-auto">
      <main className="mx-auto flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <Link href="/portal/courses" className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">My Courses</h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <div className="text-2xl font-bold">{courseCount}</div>
            <p className="text-xs text-muted-foreground">Courses you are teaching</p>
          </Link>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6">
             <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Submissions to Grade</h3>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div className="text-2xl font-bold">{submissionCount}</div>
            <p className="text-xs text-muted-foreground">Needs your attention</p>
          </div>
          <Link href="/portal/announcements" className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6 hover:shadow-md transition-shadow">
             <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Announcements</h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <div className="text-2xl font-bold">{announcementCount}</div>
            <p className="text-xs text-muted-foreground">Broadcasted to your students</p>
          </Link>
        </div>
        
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6">
             <h3 className="font-semibold leading-none tracking-tight mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                 <Link href="/portal/courses" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2">
                     Manage Assignments
                 </Link>
                 <Link href="/portal/announcements" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2">
                     Post Announcement
                 </Link>
                 <Link href="/portal/messages" className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-indigo-600 text-indigo-600 hover:bg-indigo-50 h-10 px-4 py-2 col-span-2">
                     View Messages
                 </Link>
              </div>
          </div>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Recent Submissions</h3>
              <p className="text-sm text-muted-foreground">Latest assignments turned in.</p>
            </div>
            <div className="p-6 pt-0">
               <div className="space-y-4">
                  {recentSubmissions.map((sub) => (
                    <div key={sub.id} className="flex items-center border-b pb-3 last:border-0 last:pb-0">
                      <div className="w-9 h-9 bg-blue-50 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                        {sub.student.name?.charAt(0) || sub.student.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{sub.student.name || 'Student'}</p>
                        <p className="text-xs text-muted-foreground">{sub.assignment.title}</p>
                      </div>
                      <div className="ml-auto flex flex-col items-end">
                        <span className="text-[10px] font-bold text-blue-600 px-1 py-0.5 rounded leading-none">
                            New
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(sub.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {recentSubmissions.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No recent submissions found.</p>
                  )}
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}