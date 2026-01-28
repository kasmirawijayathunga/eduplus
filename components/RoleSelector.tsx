'use client'

import { Role } from "@prisma/client"

interface RoleSelectorProps {
    defaultValue: Role;
}

export default function RoleSelector({ defaultValue }: RoleSelectorProps) {
    return (
        <select 
            name="role" 
            defaultValue={defaultValue}
            className="border rounded p-1 text-sm box-content bg-white"
            onChange={(e) => (e.target.form as HTMLFormElement).requestSubmit()}
        >
            <option value="STUDENT">Student</option>
            <option value="INSTRUCTOR">Instructor</option>
            <option value="ADMIN">Admin</option>
        </select>
    );
}
