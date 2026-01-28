import db from "@/config/db"
import { getUser } from "@/lib/dal"
import Link from "next/link"
import { deleteAssignment, createAssignment } from "../../../actions"
import { notFound } from "next/navigation"

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const user = await getUser()
  const { courseId } = await params
  
  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      assignments: {
        include: {
          _count: { select: { submissions: true } }
        }
      },
      enrollments: {
          include: { user: true }
      }
    }
  })

  if (!course || course.instructorId !== user?.id) {
    return notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 items-center gap-4">
        <Link href="/portal/courses" className="text-gray-500 hover:text-gray-700">
            ← Back to Courses
        </Link>
        <h1 className="text-2xl font-bold">{course.title} ({course.code})</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Assignments</h2>
            </div>
            
            <div className="space-y-4">
                {course.assignments.length === 0 && (
                    <div className="bg-white p-8 border rounded-lg text-center text-gray-500">
                        No assignments created yet.
                    </div>
                )}
                {course.assignments.map(assignment => (
                    <div key={assignment.id} className="bg-white p-4 border rounded-lg shadow-sm flex justify-between items-center">
                        <div>
                            <h3 className="font-bold">{assignment.title}</h3>
                            <p className="text-sm text-gray-500">Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</p>
                            <p className="text-xs text-blue-600 mt-1">{assignment._count.submissions} submissions</p>
                        </div>
                        <div className="flex gap-3">
                            <Link href={`/portal/courses/${courseId}/assignments/${assignment.id}`} className="text-sm text-indigo-600 font-medium border px-2 py-1 rounded hover:bg-indigo-50">
                                View Submissions
                            </Link>
                            <form action={async () => {
                                'use server'
                                await deleteAssignment(assignment.id)
                            }}>
                                <button type="submit" className="text-sm text-red-600 font-medium">Delete</button>
                            </form>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <div id="new-assignment-form" className="bg-white p-6 border rounded-lg shadow-sm mb-8 scroll-mt-20">
                <h2 className="text-xl font-semibold mb-4 text-indigo-600">Create Assignment</h2>
                <form action={async (formData: FormData) => {
                    'use server'
                    const title = formData.get('title') as string;
                    const description = formData.get('description') as string;
                    const dueDateInput = formData.get('dueDate') as string;
                    const dueDate = dueDateInput ? new Date(dueDateInput) : undefined;
                    
                    await createAssignment({ 
                        title, 
                        description, 
                        courseId, 
                        dueDate 
                    });
                }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input name="title" required type="text" className="w-full border rounded-md p-2 text-sm" placeholder="Assignment Title..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                        <input name="dueDate" type="date" className="w-full border rounded-md p-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea name="description" rows={3} className="w-full border rounded-md p-2 text-sm" placeholder="Assignment instructions..."></textarea>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white rounded-md py-2 text-sm font-bold hover:bg-indigo-700 transition">
                        Post Assignment
                    </button>
                </form>
            </div>

            <h2 className="text-xl font-semibold mb-4">Enrolled Students</h2>
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                <ul className="divide-y">
                    {course.enrollments.map(enrollment => (
                        <li key={enrollment.id} className="p-3 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">
                                {enrollment.user.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{enrollment.user.name}</p>
                                <p className="text-xs text-gray-500">{enrollment.user.email}</p>
                            </div>
                        </li>
                    ))}
                    {course.enrollments.length === 0 && (
                        <li className="p-6 text-center text-gray-500 text-sm">No students enrolled.</li>
                    )}
                </ul>
            </div>
        </div>
      </div>
    </div>
  )
}
