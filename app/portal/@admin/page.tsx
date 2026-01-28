import Link from "next/link"
import db from "@/config/db"

export default async function DashboardPage() {
  const [userCount, instructorCount, courseCount, assignmentCount, recentUsers] = await Promise.all([
    db.user.count(),
    db.user.count({ where: { role: 'INSTRUCTOR' } }),
    db.course.count(),
    db.assignment.count(),
    db.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, role: true }
    })
  ])

  return (
    <div className="container flex w-full flex-col mx-auto">
      <main className="mx-auto flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Link href="/portal/users" className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Users</h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div className="text-2xl font-bold">{userCount}</div>
            <p className="text-xs text-muted-foreground">Manage all users and roles</p>
          </Link>
          <Link href="/portal/instructors" className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6 hover:shadow-md transition-shadow">
             <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Instructors</h3>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div className="text-2xl font-bold">{instructorCount}</div>
            <p className="text-xs text-muted-foreground">Manage faculty members</p>
          </Link>
          <Link href="/portal/courses" className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6 hover:shadow-md transition-shadow">
             <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Courses</h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <div className="text-2xl font-bold">{courseCount}</div>
            <p className="text-xs text-muted-foreground">Assign instructors and edit courses</p>
          </Link>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6">
             <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Assignments</h3>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <div className="text-2xl font-bold">{assignmentCount}</div>
            <p className="text-xs text-muted-foreground">Across all active courses</p>
          </div>
        </div>
        
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6">
             <h3 className="font-semibold leading-none tracking-tight mb-4">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-4">
                <Link href="/portal/users/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2">
                    Add New User
                </Link>
                <Link href="/portal/courses/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2">
                    Create Course
                </Link>
             </div>
          </div>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Recent Users</h3>
              <p className="text-sm text-muted-foreground">Latest signups on the platform.</p>
            </div>
            <div className="p-6 pt-0">
               <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center border-b pb-3 last:border-0 last:pb-0">
                      <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                      </div>
                      <div className="ml-auto flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded leading-none">
                            {user.role}
                        </span>
                        <p className="text-[10px] text-gray-400 leading-none">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {recentUsers.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No recent users found.</p>
                  )}
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}