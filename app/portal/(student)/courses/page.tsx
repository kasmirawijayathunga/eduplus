import db from "@/config/db";
import { getUser } from "@/lib/dal";
import Link from "next/link";
import { enrollInCourse } from "../../actions";

export default async function CoursesPage() {
  const user = await getUser();
  if (!user) return null;

  const [allCourses, enrollments] = await Promise.all([
    db.course.findMany({
      include: { instructor: true }
    }),
    db.enrollment.findMany({
      where: { userId: user.id },
      select: { courseId: true }
    })
  ]);

  const enrolledCourseIds = new Set(enrollments.map(e => e.courseId));

  return (
    <div className="container max-w-7xl mx-auto py-10 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.has(course.id);
          return (
            <div key={course.id} className={`group overflow-hidden rounded-lg border bg-white shadow-sm transition-all ${isEnrolled ? 'hover:shadow-md' : 'opacity-75'}`}>
              <div className={`h-24 w-full ${isEnrolled ? 'bg-indigo-600' : 'bg-gray-400'}`} />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{course.code} • {course.instructor.name || 'Staff'}</p>
                
                {isEnrolled ? (
                   <Link 
                    href={`/portal/courses/${course.id}`} 
                    className="block w-full text-center bg-indigo-50 text-indigo-700 py-2 rounded font-medium hover:bg-indigo-100 transition"
                  >
                    Go to Course
                  </Link>
                ) : (
                  <form action={async () => {
                    'use server'
                    await enrollInCourse(course.id, user.id)
                  }}>
                    <button 
                      type="submit"
                      className="w-full text-center bg-gray-100 text-gray-700 py-2 rounded font-medium hover:bg-gray-200 transition"
                    >
                      Enroll Now
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
