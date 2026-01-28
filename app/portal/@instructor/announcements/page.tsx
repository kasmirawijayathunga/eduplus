import db from "@/config/db"
import { getUser } from "@/lib/dal"
import Link from "next/link"
import { deleteAnnouncement } from "../../actions"

export default async function AnnouncementsPage() {
  const user = await getUser()
  if (!user) return null

  const announcements = await db.announcement.findMany({
    where: { 
        course: { instructorId: user.id } 
    },
    include: { course: true },
    orderBy: { createdAt: 'desc' }
  })

  const myCourses = await db.course.findMany({
    where: { instructorId: user.id }
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
            {announcements.length === 0 && (
                <div className="bg-white p-12 border rounded-lg text-center text-gray-500">
                    You haven't posted any announcements yet.
                </div>
            )}
            {announcements.map(announcement => (
                <div key={announcement.id} className="bg-white p-6 border rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded mb-2 inline-block">
                                {announcement.course.code}
                            </span>
                            <h2 className="text-xl font-bold">{announcement.title}</h2>
                            <p className="text-xs text-gray-400">{new Date(announcement.createdAt).toLocaleString()}</p>
                        </div>
                        <form action={async () => {
                            'use server'
                            await deleteAnnouncement(announcement.id)
                        }}>
                            <button type="submit" className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                        </form>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
                </div>
            ))}
        </div>

        <div className="bg-white p-6 border rounded-lg shadow-sm h-fit">
            <h3 className="text-lg font-bold mb-4">New Announcement</h3>
            <form action={async (formData: FormData) => {
                'use server'
                const { createAnnouncement } = await import("../../actions")
                const courseId = formData.get('courseId') as string
                const title = formData.get('title') as string
                const content = formData.get('content') as string
                await createAnnouncement({ courseId, title, content })
            }} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Course</label>
                    <select name="courseId" required className="w-full border rounded-md p-2 text-sm bg-gray-50">
                        {myCourses.map(course => (
                            <option key={course.id} value={course.id}>{course.code} - {course.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input name="title" required type="text" className="w-full border rounded-md p-2 text-sm" placeholder="Subject..." />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea name="content" required rows={5} className="w-full border rounded-md p-2 text-sm" placeholder="Broadcast to all enrolled students..."></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white rounded-md py-2 text-sm font-bold hover:bg-indigo-700 transition-colors">
                    Post Announcement
                </button>
            </form>
        </div>
      </div>
    </div>
  )
}
