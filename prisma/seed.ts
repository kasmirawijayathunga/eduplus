import { PrismaClient, Role, SubmissionStatus } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // 1. Clear existing data (in reverse order of dependencies)
  console.log('Clearing existing data...')
  await prisma.message.deleteMany()
  await prisma.announcement.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.assignment.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()

  // 2. Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 10)

  // 3. Create Users
  console.log('Creating users...')
  
  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@eduplus.com',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  })

  // Create Instructors
  const instructor1 = await prisma.user.create({
    data: {
      email: 'john.smith@eduplus.com',
      name: 'Dr. John Smith',
      password: hashedPassword,
      role: Role.INSTRUCTOR,
    },
  })

  const instructor2 = await prisma.user.create({
    data: {
      email: 'sarah.doe@eduplus.com',
      name: 'Prof. Sarah Doe',
      password: hashedPassword,
      role: Role.INSTRUCTOR,
    },
  })

  // Create Students
  const student1 = await prisma.user.create({
    data: {
      email: 'alice@student.com',
      name: 'Alice Johnson',
      password: hashedPassword,
      role: Role.STUDENT,
    },
  })

  const student2 = await prisma.user.create({
    data: {
      email: 'bob@student.com',
      name: 'Bob Miller',
      password: hashedPassword,
      role: Role.STUDENT,
    },
  })

  const student3 = await prisma.user.create({
    data: {
      email: 'charlie@student.com',
      name: 'Charlie Brown',
      password: hashedPassword,
      role: Role.STUDENT,
    },
  })

  // 4. Create Courses
  console.log('Creating courses...')
  const course1 = await prisma.course.create({
    data: {
      title: 'Introduction to Computer Science',
      code: 'CS101',
      description: 'A fundamental course covering basics of programming and algorithms.',
      instructorId: instructor1.id,
    },
  })

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced Web Development',
      code: 'CS302',
      description: 'Deep dive into modern web frameworks and backend systems.',
      instructorId: instructor2.id,
    },
  })

  const course3 = await prisma.course.create({
    data: {
      title: 'Database Management Systems',
      code: 'CS205',
      description: 'Understanding relational databases, SQL, and NoSQL systems.',
      instructorId: instructor1.id,
    },
  })

  // 5. Create Enrollments
  console.log('Creating enrollments...')
  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: course1.id },
      { userId: student1.id, courseId: course2.id },
      { userId: student2.id, courseId: course1.id },
      { userId: student2.id, courseId: course3.id },
      { userId: student3.id, courseId: course2.id },
      { userId: student3.id, courseId: course3.id },
    ],
  })

  // 6. Create Announcements
  console.log('Creating announcements...')
  await prisma.announcement.create({
    data: {
      title: 'Welcome to CS101',
      content: 'Welcome everyone! I hope you are excited to learn about Computer Science.',
      courseId: course1.id,
    },
  })

  await prisma.announcement.create({
    data: {
      title: 'Project Deadline Extended',
      content: 'The final project deadline has been moved to next Friday.',
      courseId: course2.id,
    },
  })

  // 7. Create Assignments
  console.log('Creating assignments...')
  const assignment1 = await prisma.assignment.create({
    data: {
      title: 'Logic Gates Homework',
      description: 'Complete the worksheets provided in class.',
      courseId: course1.id,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  })

  const assignment2 = await prisma.assignment.create({
    data: {
      title: 'React Components Project',
      description: 'Build a simple dashboard using React functional components.',
      courseId: course2.id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  })

  // 8. Create Submissions
  console.log('Creating submissions...')
  await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: student1.id,
      status: SubmissionStatus.SUBMITTED,
      content: 'Submitted my homework through the file portal.',
      fileUrl: 'https://example.com/homework1.pdf',
    },
  })

  await prisma.submission.create({
    data: {
      assignmentId: assignment1.id,
      studentId: student2.id,
      status: SubmissionStatus.GRADED,
      content: 'Attached file for review.',
      fileUrl: 'https://example.com/homework1_bob.pdf',
      grade: 95.0,
      gradedAt: new Date(),
    },
  })

  // 9. Create Messages
  console.log('Creating messages...')
  await prisma.message.create({
    data: {
      senderId: student1.id,
      receiverId: instructor1.id,
      content: 'Hello Professor, I have a question about the logic gates assignment.',
    },
  })

  await prisma.message.create({
    data: {
      senderId: instructor1.id,
      receiverId: student1.id,
      content: 'Sure Alice, meet me during office hours tomorrow at 10 AM.',
    },
  })

  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
