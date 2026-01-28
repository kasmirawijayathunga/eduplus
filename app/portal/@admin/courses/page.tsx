import db from "@/config/db"
import Link from "next/link"
import { deleteCourse, assignInstructorToCourse } from "../../actions"

export default async function CoursesPage() {
  const [courses, instructors] = await Promise.all([
    db.course.findMany({
      include: { instructor: true },
      orderBy: { createdAt: 'desc' }
    }),
    db.user.findMany({
      where: { role: 'INSTRUCTOR' }
    })
  ])

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <Link href="/portal/courses/new" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Create New Course
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{course.code}</span>
                <span className="text-xs text-gray-500">{new Date(course.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">{course.description || 'No description provided.'}</p>
              
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500 mb-1">Assigned Instructor:</p>
                <span>{instructors.find((inst) => inst.id === course.instructorId)?.name}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 px-5 py-3 flex justify-between border-t">
              <div className="flex gap-4">
                 <Link href={`/portal/courses/${course.id}/edit`} className="text-sm font-medium text-indigo-600 hover:text-indigo-800 border px-2 py-1 rounded">Edit</Link>
              </div>
              <form action={async () => {
                'use server'
                await deleteCourse(course.id)
              }}>
                <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-800 border px-2 py-1 rounded">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
