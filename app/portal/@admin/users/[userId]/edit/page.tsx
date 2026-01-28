import { updateUser } from "@/app/portal/actions";
import db from "@/config/db";
import { Role } from "@prisma/client";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function EditUserPage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    
    const user = await db.user.findUnique({
        where: { id: userId }
    });

    if (!user) {
        return notFound();
    }

    async function handleUpdateUser(formData: FormData) {
        'use server'
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as Role;

        await updateUser(userId, { name, email, role });
        redirect('/portal/users');
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="mb-6">
                <Link href="/portal/users" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                    &larr; Back to Users
                </Link>
                <h1 className="text-3xl font-bold mt-2">Edit User</h1>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border">
                <form action={handleUpdateUser} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input 
                            name="name" 
                            type="text" 
                            defaultValue={user.name || ''}
                            required 
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input 
                            name="email" 
                            type="email" 
                            defaultValue={user.email}
                            required 
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select 
                            name="role" 
                            defaultValue={user.role}
                            required 
                            className="w-full border rounded-md p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                        >
                            <option value="STUDENT">Student</option>
                            <option value="INSTRUCTOR">Instructor</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    
                    <div className="pt-4 flex gap-4">
                        <button 
                            type="submit" 
                            className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-md hover:bg-indigo-700 transition"
                        >
                            Update User
                        </button>
                        <Link 
                            href="/portal/users" 
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
