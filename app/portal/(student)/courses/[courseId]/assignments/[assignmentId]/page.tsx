import Link from "next/link";
import db from "@/config/db";
import { getUser } from "@/lib/dal";
import { notFound } from "next/navigation";

export default async function AssignmentSubmissionPage({ params }: { params: Promise<{ courseId: string; assignmentId: string }> }) {
  const user = await getUser();
  if (!user) return null;

  const {courseId, assignmentId} = await params;

  const assignment = await db.assignment.findUnique({
    where: { id: assignmentId },
    include: {
        course: true,
        submissions: {
            where: { studentId: user.id }
        }
    }
  });

  if (!assignment || assignment.courseId !== courseId) {
    return notFound();
  }

  const submission = assignment.submissions[0];
  const status = submission ? (submission.grade !== null ? 'Graded' : 'Submitted') : 'Pending';

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
       <div className="mb-6">
             <Link href={`/portal/courses/${courseId}/assignments`} className="text-sm text-gray-500 hover:text-indigo-600 mb-2 inline-block">&larr; Back to Assignments</Link>
             <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{assignment.title}</h1>
                    <p className="text-gray-500">
                        Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No Due Date'}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                    status === 'Submitted' ? 'bg-blue-100 text-blue-800' : 
                    'bg-green-100 text-green-800'
                }`}>
                    {status}
                </span>
             </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                 <section className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Instructions</h2>
                    <div className="prose max-w-none text-gray-600">
                        <p>{assignment.description || 'No instructions provided.'}</p>
                    </div>
                </section>

                <section className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Submission</h2>
                    {submission ? (
                        <div className="p-6 bg-gray-50 rounded-lg border">
                            <p className="text-sm font-semibold text-gray-500 mb-2">Your Content:</p>
                            <div className="bg-white p-4 rounded border text-gray-700 whitespace-pre-wrap">
                                {submission.content || "N/A"}
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Submitted on {new Date(submission.submittedAt).toLocaleString()}</p>
                        </div>
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-500 italic">
                             Use the main course page to submit this assignment.
                        </div>
                    )}
                </section>
            </div>
            
            <div>
                 <section className="bg-white rounded-xl p-6 shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Grading</h2>
                    {submission && submission.grade !== null ? (
                        <div className="text-center">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">{submission.grade}</div>
                            <p className="text-sm text-gray-500 italic">Graded on {submission.gradedAt ? new Date(submission.gradedAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500 italic">No grade or feedback yet.</p>
                    )}
                  </section>
            </div>
        </div>
    </div>
  )
}
