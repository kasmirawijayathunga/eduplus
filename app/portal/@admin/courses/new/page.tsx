import { createCourse } from "@/app/portal/actions";
import db from "@/config/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NewCoursePage() {
    const instructors = await db.user.findMany({
        where: { role: 'INSTRUCTOR' },
        select: { id: true, name: true, email: true }
    });

    async function handleCreateCourse(formData: FormData) {
        'use server'
        const title = formData.get('title') as string;
        const code = formData.get('code') as string;
        const description = formData.get('description') as string;
        const instructorId = formData.get('instructorId') as string;

        await createCourse({ title, code, description, instructorId });
        redirect('/portal/courses');
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-6">
                <Link href="/portal/courses" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    &larr; Back to Courses
                </Link>
                <h1 className="text-3xl font-bold mt-2">Create New Course</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
                <form action={handleCreateCourse} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                        <input 
                            name="title" 
                            type="text" 
                            required 
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Introduction to Computer Science"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                        <input 
                            name="code" 
                            type="text" 
                            required 
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="CS101"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                        <select 
                            name="instructorId" 
                            required 
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                        >
                            <option value="">Select an instructor</option>
                            {instructors.map(inst => (
                                <option key={inst.id} value={inst.id}>{inst.name || inst.email}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea 
                            name="description" 
                            rows={4}
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            placeholder="Provide a brief overview of the course content..."
                        ></textarea>
                    </div>
                    
                    <div className="pt-4 flex gap-4">
                        <button 
                            type="submit" 
                            className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-md hover:bg-indigo-700 transition"
                        >
                            Create Course
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
