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
    .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' })
    .trim(),
  name: z.string().min(1, { message: 'Name is required' })
})

export async function handleRegister( prevState: any, formData: FormData ): Promise<{ errors?: { email?: string[], password?: string[], name?: string[], global?: string[] } }> {
    let redirectPath: string | null = null

    try {
        const validatedFields = schema.safeParse({
            email: formData?.get('email') ?? "",
            password: formData?.get('password') ?? "",
            name: formData?.get('name') ?? ""
        })

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            }
        }

        const { email, password, name } = validatedFields.data

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return {
                errors: {
                    email: ["Email is already registered."]
                }
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'STUDENT', 
            }
        });

        const tokens = await generateTokens({
            id: newUser.id,
            role: 0, // Student role map to 0
            email: newUser.email,
            name: newUser.name ?? ""
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