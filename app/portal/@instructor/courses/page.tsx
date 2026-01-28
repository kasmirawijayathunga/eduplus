import db from "@/config/db"
import { getUser } from "@/lib/dal"
import Link from "next/link"

export default async function InstructorCoursesPage() {
  const user = await getUser()
  if (!user) return null

  const courses = await db.course.findMany({
    where: { instructorId: user.id },
    include: {
      _count: {
        select: { enrollments: true, assignments: true }
      }
    }
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Courses</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div key={course.id} className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col hover:border-blue-400 transition-colors">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{course.code}</span>
              </div>
              <h2 className="text-xl font-bold mb-2">{course.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">{course.description || 'No description provided.'}</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-500 uppercase">Students</p>
                    <p className="font-bold">{course._count.enrollments}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                    <p className="text-xs text-gray-500 uppercase">Assignments</p>
                    <p className="font-bold">{course._count.assignments}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-5 py-3 border-t">
              <Link href={`/portal/courses/${course.id}`} className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-800">
                Manage Course & Assignments
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
