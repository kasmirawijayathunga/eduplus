'use server'

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";
import db from "@/config/db";
import bcrypt from "bcrypt";
import { generateTokens } from "@/services/Auth";


// Schema for validation
const schema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    // .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' })
    .trim(),
})

export async function handleLogin( prevState: any, formData: FormData ): Promise<{ errors?: { email?: string[], password?: string[], global?: string[] } }> {
    let redirectPath: string | null = null

    try {
        const validatedFields = schema.safeParse({
            email: formData?.get('email') ?? "",
            password: formData?.get('password') ?? "",
        })

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const { email, password } = validatedFields.data

        const data = await db.user.findUnique({
            where: { email },
            select: { id: true, password: true, role: true, name: true, email: true },
        });

        if (!data) {
             return {
                errors: {
                    global: ["Invalid email or password"]
                }
            }
        }

        const matchPassword = await bcrypt.compare(password, data.password);

        if (!matchPassword) {
            return {
                errors: {
                    global: ["Invalid email or password"]
                }
            }
        }

        console.log(data);
        
        const tokens = await generateTokens({
            id: data.id,
            role: data.role === 'ADMIN' ? 1 : data.role === 'INSTRUCTOR' ? 2 : 0, // Mapping Role enum to number
            email: data.email,
            name: data.name ?? ""
        });

        await createSession(tokens)
        redirectPath = "/portal"
    } catch (error) {
        console.log(error)
        return {
            errors: {
                 global: ["Something went wrong. Please try again."]
            }
        }
    } finally {
        if (redirectPath) redirect(redirectPath)
    }
    return {
        errors: {}
    }
}