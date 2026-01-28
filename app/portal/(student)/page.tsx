import { getStudentDashboardData } from "@/lib/dal"
import Link from "next/link"

export default async function DashboardPage() {
  const data = await getStudentDashboardData()

  const recentActivity = [
    ...data.submissions.map(s => ({
      type: 'Assignment Submitted',
      title: s.assignment.title,
      status: 'Completed',
      color: 'text-green-600',
      date: s.submittedAt
    })),
    ...data.announcements.map(a => ({
      type: 'New Announcement',
      title: a.title,
      status: 'Info',
      color: 'text-blue-600',
      date: a.createdAt
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)

  return (
    <div className="container flex w-full flex-col mx-auto">
      <main className="mx-auto flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Total Courses</h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
            </div>
            <div className="text-2xl font-bold">{data.enrollmentCount}</div>
            <p className="text-xs text-muted-foreground">Enrolled Courses</p>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6">
             <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Assignments Due</h3>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div className="text-2xl font-bold">{data.pendingAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Pending Submissions</p>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6">
             <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Average Grade</h3>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <div className="text-2xl font-bold">{data.averageGrade ? data.averageGrade.toFixed(1) : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Performance Overview</p>
          </div>
          <Link href="/portal/messages" className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white p-6 hover:shadow-md transition-shadow">
             <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium">Messages</h3>
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <div className="text-2xl font-bold">{data.unreadMessagesCount}</div>
            <p className="text-xs text-muted-foreground">Unread Messages</p>
          </Link>
        </div>
        
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-xl border bg-card text-card-foreground shadow-sm bg-white">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Recent Activity</h3>
              <p className="text-sm text-muted-foreground">Your latest interactions and updates.</p>
            </div>
            <div className="p-6 pt-0">
               <div className="space-y-8">
                  {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{activity.type}</p>
                        <p className="text-sm text-muted-foreground">{activity.title}</p>
                      </div>
                      <div className={`ml-auto font-medium ${activity.color}`}>{activity.status}</div>
                    </div>
                  )) : (
                    <p className="text-sm text-gray-400 text-center py-4">No recent activity found.</p>
                  )}
                </div>
            </div>
          </div>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm bg-white">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="font-semibold leading-none tracking-tight">Upcoming Deadlines</h3>
              <p className="text-sm text-muted-foreground">Stay on top of your work.</p>
            </div>
            <div className="p-6 pt-0">
               <ul className="space-y-4">
                  {data.pendingAssignments.length > 0 ? data.pendingAssignments.map((assign) => {
                    const diff = assign.dueDate ? Math.ceil((new Date(assign.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
                    const statusText = diff === null ? 'No Date' : diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `${diff} Days`;
                    const statusColor = diff !== null && diff <= 1 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';

                    return (
                      <li key={assign.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                          <span className="text-sm font-medium truncate max-w-[150px]">{assign.title}</span>
                          <span className={`text-xs px-2 py-1 rounded ${statusColor}`}>{statusText}</span>
                      </li>
                    );
                  }) : (
                    <p className="text-sm text-gray-400 text-center py-4">No upcoming deadlines.</p>
                  )}
               </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
