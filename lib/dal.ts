'use server'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createSession, getSession } from './session'
import { AuthUser, generateTokens } from '@/services/Auth'
import db from '@/config/db'
import config from '@/config/config'
import jwt from 'jsonwebtoken'

const refreshSession = async (session: AuthUser) => {
    try {
        const tokenData = jwt.verify(session.refresh!.token, config.jwt.secret) as { id: string };
        const user = await db.user.findUniqueOrThrow({
            where: { id: tokenData.id },
            select: { id: true, role: true, email: true, name: true },
        });

        const newTokens = await generateTokens({
            id: user.id,
            role: user.role === 'ADMIN' ? 1 : user.role === 'INSTRUCTOR' ? 2 : 0, // Mapping Role enum to number
            email: user.email,
            name: user.name ?? ""
        });

        const newSession = {
            ...newTokens,
        };

        await createSession(newSession);
        return newSession;
    } catch (error) {
        console.log('Failed to refresh session', error)
        return null
    }
}

const verifySession = async (session: AuthUser) => {
    try {
        const tokenData = jwt.verify(session.access.token, config.jwt.secret);
        return { isAuth: true, data: session }
    } catch (error) {
        console.log('Failed to verify session')
        return { isAuth: false, data: null }
    }
} 

export const getUser = cache(async () => {
    const session = await getSession()
    if (!session?.id) redirect('/auth/login')

    let currentSession = session;

    if (new Date(session.access.expire).getTime() - Date.now() < 5 * 60 * 1000) {
        const newSession = await refreshSession(session);
        if (newSession) {
            currentSession = newSession;
        }
    }

    const verifiedSession = await verifySession(currentSession)
    return verifiedSession.data
})

export const getUserProfile = cache(async () => {
    const user = await getUser()
    if (!user) redirect('/auth/login')

    try {
        const fullUser = await db.user.findUniqueOrThrow({
            where: { id: user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
            }
        })
        return fullUser
    } catch (error) {
        console.error('Failed to fetch user profile:', error)
        redirect('/auth/login')
    }
})

export const getStudentDashboardData = cache(async () => {
    const user = await getUser()
    if (!user) redirect('/auth/login')

    try {
        const [enrollmentCount, pendingAssignments, submissions, announcements] = await Promise.all([
            db.enrollment.count({ where: { userId: user.id } }),
            db.assignment.findMany({
                where: {
                    course: {
                        enrollments: { some: { userId: user.id } }
                    },
                    submissions: {
                        none: { studentId: user.id }
                    },
                    OR: [
                        { dueDate: { gte: new Date() } },
                        { dueDate: null }
                    ]
                },
                orderBy: { dueDate: 'asc' },
                take: 5
            }),
            db.submission.findMany({
                where: { studentId: user.id },
                include: { assignment: true },
                orderBy: { submittedAt: 'desc' },
                take: 5
            }),
            db.announcement.findMany({
                where: {
                    course: {
                        enrollments: { some: { userId: user.id } }
                    }
                },
                include: { course: true },
                orderBy: { createdAt: 'desc' },
                take: 5
            })
        ])

        // Calculate average grade (simple version)
        const gradedSubmissions = await db.submission.findMany({
            where: { studentId: user.id, grade: { not: null } },
            select: { grade: true }
        })
        const averageGrade = gradedSubmissions.length > 0
            ? gradedSubmissions.reduce((acc, curr) => acc + (curr.grade || 0), 0) / gradedSubmissions.length
            : null

        // Unread messages count
        const unreadMessagesCount = await db.message.count({
            where: { receiverId: user.id, read: false }
        })

        return {
            enrollmentCount,
            pendingAssignments,
            submissions,
            announcements,
            averageGrade,
            unreadMessagesCount
        }
    } catch (error) {
        console.error('Failed to fetch student dashboard data:', error)
        throw error
    }
})

export const getConversations = cache(async () => {
    const user = await getUser()
    if (!user) return []

    // Find all users who sent messages to current user OR received messages from current user
    const messages = await db.message.findMany({
        where: {
            OR: [
                { senderId: user.id },
                { receiverId: user.id }
            ]
        },
        include: {
            sender: { select: { id: true, name: true, email: true, role: true } },
            // receiver placeholder - standard Prisma doesn't easily let us find the "other" side in a single select
            // so we'll fetch details for all and process
        },
        orderBy: { createdAt: 'desc' }
    })

    // Group by "other user"
    const conversationsMap = new Map()
    
    // We need receiver names too
    const receiverIds = [...new Set(messages.map(m => m.receiverId))]
    const receivers = await db.user.findMany({
        where: { id: { in: receiverIds } },
        select: { id: true, name: true, email: true, role: true }
    })
    const receiversMap = new Map(receivers.map(r => [r.id, r]))

    messages.forEach(msg => {
        const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId
        if (!conversationsMap.has(otherUserId)) {
            const otherUser = msg.senderId === user.id ? receiversMap.get(msg.receiverId) : msg.sender;
            if (otherUser) { // Safety check
                conversationsMap.set(otherUserId, {
                    otherUser,
                    lastMessage: msg,
                    unreadCount: msg.receiverId === user.id && !msg.read ? 1 : 0
                })
            }
        } else if (msg.receiverId === user.id && !msg.read) {
            const conv = conversationsMap.get(otherUserId);
            if (conv) conv.unreadCount++
        }
    })

    return Array.from(conversationsMap.values())
})

export const getMessagesWithUser = cache(async (otherUserId: string) => {
    const user = await getUser()
    if (!user) return []

    return await db.message.findMany({
        where: {
            OR: [
                { senderId: user.id, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: user.id }
            ]
        },
        orderBy: { createdAt: 'asc' }
    })
})

export const getAvailableContacts = cache(async () => {
    const user = await getUser()
    if (!user) return []

    // For simplicity, let's allow everyone to message everyone for now,
    // or we can restrict based on role.
    // Admin: can message everyone
    // Instructor: can message everyone
    // Student: can message instructors and admins
    
    const role = user.role === 1 ? 'ADMIN' : user.role === 2 ? 'INSTRUCTOR' : 'STUDENT'

    if (role === 'ADMIN' || role === 'INSTRUCTOR') {
        return await db.user.findMany({
            where: { id: { not: user.id } },
            select: { id: true, name: true, email: true, role: true },
            orderBy: { name: 'asc' }
        })
    } else {
        return await db.user.findMany({
            where: { 
                id: { not: user.id },
                role: { in: ['ADMIN', 'INSTRUCTOR'] }
            },
            select: { id: true, name: true, email: true, role: true },
            orderBy: { name: 'asc' }
        })
    }
})