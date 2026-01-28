import { updateCourse } from "@/app/portal/actions";
import db from "@/config/db";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    
    const [course, instructors] = await Promise.all([
        db.course.findUnique({
            where: { id: courseId }
        }),
        db.user.findMany({
            where: { role: 'INSTRUCTOR' },
            select: { id: true, name: true, email: true }
        })
    ]);

    if (!course) {
        return notFound();
    }

    async function handleUpdateCourse(formData: FormData) {
        'use server'
        const title = formData.get('title') as string;
        const code = formData.get('code') as string;
        const description = formData.get('description') as string;
        const instructorId = formData.get('instructorId') as string;

        await updateCourse(courseId, { title, code, description, instructorId });
        redirect('/portal/courses');
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-6">
                <Link href="/portal/courses" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    &larr; Back to Courses
                </Link>
                <h1 className="text-3xl font-bold mt-2">Edit Course</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
                <form action={handleUpdateCourse} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                        <input 
                            name="title" 
                            type="text" 
                            defaultValue={course.title}
                            required 
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                        <input 
                            name="code" 
                            type="text" 
                            defaultValue={course.code}
                            required 
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                        <select 
                            name="instructorId" 
                            defaultValue={course.instructorId}
                            required 
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                        >
                            {instructors.map(inst => (
                                <option key={inst.id} value={inst.id}>{inst.name || inst.email}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            name="description" 
                            defaultValue={course.description || ''}
                            rows={4}
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        ></textarea>
                    </div>
                    
                    <div className="pt-4 flex gap-4">
                        <button 
                            type="submit" 
                            className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-md hover:bg-indigo-700 transition"
                        >
                            Update Course
                        </button>
                        <Link 
                            href="/portal/courses" 
                            className="flex-1 text-center border font-bold py-2.5 rounded-md hover:bg-gray-50 transition"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
