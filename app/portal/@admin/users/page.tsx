import db from "@/config/db"
import Link from "next/link"
import { updateUserRole, deleteUser } from "../../actions"
import { Role } from "@prisma/client"
import RoleSelector from "@/components/RoleSelector"

export default async function UsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link href="/portal/users/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add User
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link href={`/portal/users/${user.id}/edit`} className="text-indigo-600 hover:text-indigo-900 border px-2 py-1 rounded">Edit</Link>
                    <form action={async () => {
                      'use server'
                      await deleteUser(user.id)
                    }}>
                      <button type="submit" className="text-red-600 hover:text-red-900 border px-2 py-1 rounded">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
