import Link from "next/link";
import db from "@/config/db";
import { getUser } from "@/lib/dal";
import { notFound } from "next/navigation";

export default async function AssignmentsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const user = await getUser();
  if (!user) return null;

  const {courseId} = await params;

  const assignments = await db.assignment.findMany({
    where: { courseId },
    include: {
        submissions: {
            where: { studentId: user.id }
        }
    },
    orderBy: { dueDate: 'asc' }
  });

  if (!assignments) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="mb-8">
             <Link href={`/portal/courses/${courseId}`} className="text-sm text-gray-500 hover:text-indigo-600 mb-2 inline-block">&larr; Back to Course</Link>
             <h1 className="text-3xl font-bold">Assignments</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border divide-y">
            {assignments.length > 0 ? assignments.map((assign) => {
                const submission = assign.submissions[0];
                const status = submission ? (submission.grade !== null ? 'Graded' : 'Submitted') : 'Pending';
                
                return (
                    <div key={assign.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-gray-50 transition">
                        <div className="mb-4 sm:mb-0">
                            <Link href={`/portal/courses/${courseId}/assignments/${assign.id}`} className="text-lg font-semibold hover:text-indigo-600">
                                {assign.title}
                            </Link>
                            <div className="text-sm text-gray-500 mt-1">
                                Due: {assign.dueDate ? new Date(assign.dueDate).toLocaleDateString() : 'No Due Date'}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 
                                'bg-green-100 text-green-800'
                            }`}>
                                {status}
                            </span>
                            <Link href={`/portal/courses/${courseId}/assignments/${assign.id}`} className="px-4 py-2 bg-white border rounded-md text-sm font-medium hover:bg-gray-50 transition">
                                View Details
                            </Link>
                        </div>
                    </div>
                );
            }) : (
                <div className="p-12 text-center text-gray-500">
                    No assignments found for this course.
                </div>
            )}
        </div>
    </div>
  )
}
