import db from "@/config/db";
import { getUser } from "@/lib/dal";
import Link from "next/link";
import { notFound } from "next/navigation";
import { gradeSubmission } from "@/app/portal/actions";

export default async function AssignmentSubmissionsPage({ params }: { params: Promise<{ courseId: string; assignmentId: string }> }) {
    const user = await getUser();
    const { courseId, assignmentId } = await params;

    const assignment = await db.assignment.findUnique({
        where: { id: assignmentId },
        include: {
            course: {
                include: {
                    enrollments: {
                        include: { user: true }
                    }
                }
            },
            submissions: {
                include: { student: true }
            }
        }
    });

    if (!assignment || assignment.courseId !== courseId || assignment.course.instructorId !== user?.id) {
        return notFound();
    }

    // Merge enrollments with submissions
    const submissionData = assignment.course.enrollments.map(enrollment => {
        const submission = assignment.submissions.find(s => s.studentId === enrollment.userId);
        return {
            student: enrollment.user,
            submission: submission || null
        };
    });

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6 items-center gap-4">
                <Link href={`/portal/courses/${courseId}`} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    &larr; Back to Course
                </Link>
                <h1 className="text-2xl font-bold">{assignment.title} - Submissions</h1>
            </div>

            <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {submissionData.map(({ student, submission }) => (
                            <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{student.name || 'N/A'}</div>
                                    <div className="text-xs text-gray-500">{student.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        submission ? (submission.grade !== null ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800') : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {submission ? (submission.grade !== null ? 'Graded' : 'Submitted') : 'Pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {submission ? new Date(submission.submittedAt).toLocaleString() : '-'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {submission?.content || (submission?.fileUrl ? 'File Uploaded' : 'No content')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {submission ? (
                                        <form action={async (formData: FormData) => {
                                            'use server'
                                            const grade = parseFloat(formData.get('grade') as string);
                                            if (!isNaN(grade)) {
                                                await gradeSubmission(submission.id, grade);
                                            }
                                        }} className="flex items-center justify-end gap-2">
                                            <input 
                                                name="grade" 
                                                type="number" 
                                                defaultValue={submission.grade || ''} 
                                                step="1"
                                                className="w-16 border rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                                                placeholder="0-100"
                                            />
                                            <button type="submit" className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-2 py-1 rounded">
                                                Save
                                            </button>
                                        </form>
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {submissionData.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No students enrolled in this course.
                    </div>
                )}
            </div>
        </div>
    );
}
