import db from "@/config/db"
import { getUser } from "@/lib/dal"
import Link from "next/link"
import { notFound } from "next/navigation"
import { submitAssignment } from "../../../actions"

export default async function StudentCourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const user = await getUser()
  const { courseId } = await params

  const course = await db.course.findUnique({
    where: { id: courseId },
    include: {
      instructor: true,
      assignments: {
        include: {
          submissions: {
            where: { studentId: user?.id }
          }
        }
      },
      enrollments: {
        where: { userId: user?.id }
      }
    }
  })

  const isEnrolled = (course?.enrollments?.length ?? 0) > 0

  if (!course || !isEnrolled) {
    return notFound()
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <Link href="/portal/courses" className="text-sm text-gray-500 hover:text-indigo-600 mb-2 inline-block">
            ← Back to Courses
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{course.code}</span>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-gray-600 mt-1">Instructor: {course.instructor.name}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4">Course Content & Assignments</h2>
            <div className="space-y-4">
                {course.assignments.map(assignment => {
                    const submission = assignment.submissions[0]
                    return (
                        <div key={assignment.id} className="bg-white border rounded-lg p-5 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg">{assignment.title}</h3>
                                    <p className="text-sm text-gray-500">Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No due date'}</p>
                                </div>
                                {submission ? (
                                    <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">
                                        Submitted on {new Date(submission.submittedAt).toLocaleDateString()}
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                        Pending
                                    </span>
                                )}
                            </div>
                            <p className="text-gray-700 text-sm mb-4">{assignment.description || 'No description provided.'}</p>
                            
                            {!submission && (
                                <form action={async (formData: FormData) => {
                                    'use server'
                                    const content = formData.get('content') as string
                                    await submitAssignment({
                                        assignmentId: assignment.id,
                                        studentId: user!.id,
                                        content
                                    })
                                }} className="mt-4 pt-4 border-t">
                                    <textarea 
                                        name="content" 
                                        required 
                                        placeholder="Type your submission content here..."
                                        className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        rows={3}
                                    ></textarea>
                                    <button 
                                        type="submit"
                                        className="mt-2 bg-indigo-600 text-white px-4 py-1.5 rounded text-sm font-bold hover:bg-indigo-700 transition"
                                    >
                                        Submit Assignment
                                    </button>
                                </form>
                            )}
                            
                            {submission && (
                                <div className="mt-2 p-3 bg-gray-50 rounded text-sm">
                                    <p className="font-semibold text-gray-500 mb-1">Your Submission:</p>
                                    <p className="text-gray-700 italic">"{submission.content || 'N/A'}"</p>
                                    {submission.grade && (
                                        <div className="mt-2 pt-2 border-t font-bold text-indigo-600">
                                            Grade: {submission.grade}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )
                })}
                {course.assignments.length === 0 && (
                    <div className="p-10 border rounded-lg text-center text-gray-400">
                        No assignments posted for this course.
                    </div>
                )}
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg">
                <h3 className="text-lg font-bold mb-2">Course Information</h3>
                <p className="text-indigo-100 text-sm mb-4 leading-relaxed">
                    {course.description || "Welcome to the course! Here you will find all the resources and assignments required for your learning journey."}
                </p>
                <div className="text-sm font-medium">
                    {course.enrollments[0] && (
                        <p>Enrolled since: {new Date(course.enrollments[0].enrolledAt).toLocaleDateString()}</p>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
