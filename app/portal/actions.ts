'use server'

import db from "@/config/db"
import { revalidatePath } from "next/cache"
import { Role } from "@prisma/client"
import { getUser } from "@/lib/dal"

// -------------------------------- User Actions --------------------------------

export async function updateUserRole(userId: string, role: Role) {
  await db.user.update({
    where: { id: userId },
    data: { role }
  })
  revalidatePath('/portal/users')
  revalidatePath('/portal/instructors')
}

export async function updateUser(userId: string, data: { name: string, email: string, role: Role }) {
  await db.user.update({
    where: { id: userId },
    data
  })
  revalidatePath('/portal/users')
  revalidatePath('/portal/instructors')
}

export async function deleteUser(userId: string) {
  await db.user.delete({
    where: { id: userId }
  })
  revalidatePath('/portal/users')
  revalidatePath('/portal/instructors')
}

export async function createUser(data: { name: string, email: string, role: Role }) {
  // Note: Password should be handled properly, for now setting a default or random one if not provided
  // In a real app, you'd send an invite email or set a temp password
  await db.user.create({
    data: {
      ...data,
      password: 'password123' // Default password for now as per "dummy data" spirit or requirement
    }
  })
  revalidatePath('/portal/users')
}

// -------------------------------- Course Actions --------------------------------

export async function createCourse(data: { title: string, code: string, description?: string, instructorId: string }) {
  await db.course.create({
    data
  })
  revalidatePath('/portal/courses')
}

export async function updateCourse(id: string, data: { title: string, code: string, description?: string, instructorId: string }) {
  await db.course.update({
    where: { id },
    data
  })
  revalidatePath('/portal/courses')
}

export async function deleteCourse(id: string) {
  await db.course.delete({
    where: { id }
  })
  revalidatePath('/portal/courses')
}

// -------------------------------- Instructor Actions (specific subset) --------------------------------

export async function assignInstructorToCourse(courseId: string, instructorId: string) {
  await db.course.update({
    where: { id: courseId },
    data: { instructorId }
  })
  revalidatePath('/portal/courses')
}

// -------------------------------- Assignment Actions --------------------------------

export async function createAssignment(data: { title: string, description?: string, courseId: string, dueDate?: Date }) {
  await db.assignment.create({
    data
  })
  revalidatePath(`/portal/courses/${data.courseId}`)
}

export async function updateAssignment(id: string, data: { title: string, description?: string, dueDate?: Date }) {
  const assignment = await db.assignment.update({
    where: { id },
    data,
    select: { courseId: true }
  })
  revalidatePath(`/portal/courses/${assignment.courseId}`)
}

export async function deleteAssignment(id: string) {
  const assignment = await db.assignment.delete({
    where: { id },
    select: { courseId: true }
  })
  revalidatePath(`/portal/courses/${assignment.courseId}`)
}

// -------------------------------- Announcement Actions --------------------------------

export async function createAnnouncement(data: { title: string, content: string, courseId: string }) {
  await db.announcement.create({
    data
  })
  revalidatePath('/portal/announcements')
}

export async function deleteAnnouncement(id: string) {
  await db.announcement.delete({
    where: { id }
  })
  revalidatePath('/portal/announcements')
}

// -------------------------------- Student Actions --------------------------------

export async function enrollInCourse(courseId: string, userId: string) {
  await db.enrollment.create({
    data: {
      courseId,
      userId
    }
  })
  revalidatePath('/portal/courses')
}

export async function submitAssignment(data: { assignmentId: string, studentId: string, content?: string, fileUrl?: string }) {
  await db.submission.create({
    data: {
      ...data,
      status: 'SUBMITTED'
    }
  })
  const assignment = await db.assignment.findUnique({
      where: { id: data.assignmentId },
      select: { courseId: true }
  })
  if (assignment) {
      revalidatePath(`/portal/courses/${assignment.courseId}`)
  }
}

export async function gradeSubmission(submissionId: string, grade: number) {
    const submission = await db.submission.update({
        where: { id: submissionId },
        data: { 
            grade,
            status: 'GRADED',
            gradedAt: new Date()
        },
        include: { assignment: true }
    })
    revalidatePath(`/portal/courses/${submission.assignment.courseId}/assignments/${submission.assignmentId}`)
}

// -------------------------------- Messaging Actions --------------------------------

export async function sendMessage(receiverId: string, content: string) {
    const user = await getUser()
    if (!user) throw new Error("Unauthorized")

    await db.message.create({
        data: {
            senderId: user.id,
            receiverId,
            content
        }
    })
    revalidatePath('/portal/messages')
}

export async function markMessageAsRead(messageId: string) {
    await db.message.update({
        where: { id: messageId },
        data: { read: true }
    })
    revalidatePath('/portal/messages')
}

export async function markMessagesAsRead(senderId: string) {
    const user = await getUser()
    if (!user) throw new Error("Unauthorized")

    await db.message.updateMany({
        where: {
            senderId,
            receiverId: user.id,
            read: false
        },
        data: { read: true }
    })
    revalidatePath('/portal/messages')
}

export async function updateUserProfile(data: { name: string }) {
    const user = await getUser()
    if (!user) throw new Error("Unauthorized")

    await db.user.update({
        where: { id: user.id },
        data: { name: data.name }
    })
    revalidatePath('/profile')
}


