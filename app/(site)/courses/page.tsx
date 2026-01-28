import db from "@/config/db";
import Link from "next/link";

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    include: {
      instructor: {
        select: { name: true, email: true }
      },
      _count: {
        select: { assignments: true, enrollments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen pb-20 mx-auto">
      {/* Hero Section */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                Explore Our <span className="text-indigo-600">Courses</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Enhance your skills with our curated selection of high-quality courses taught by industry experts.
            </p>
        </div>
      </section>

      <main className="container max-w-7xl mx-auto pb-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.length > 0 ? courses.map((course) => (
                <div key={course.id} className="group bg-white rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col">
                    <div className="h-48 bg-indigo-50 flex items-center justify-center p-8 overflow-hidden">
                        <span className="text-6xl font-bold text-indigo-200 group-hover:scale-110 group-hover:text-indigo-300 transition-all duration-500">
                            {course.code}
                        </span>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                {course.code}
                            </span>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                            {course.title}
                        </h2>
                        
                        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-1">
                            {course.description || "No description provided for this course. Start learning today and expand your horizons with our expert-led content."}
                        </p>

                        <div className="pt-6 border-t mt-auto">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm font-sans">
                                        {course.instructor.name?.charAt(0) || 'I'}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-800 leading-none mb-1">
                                            {course.instructor.name || "Instructor"}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                                            Expert Faculty
                                        </span>
                                    </div>
                                </div>
                                <Link 
                                    href={`/auth/login?redirect=/portal/courses/${course.id}`} 
                                    className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    Enroll
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )) : (
                <div className="col-span-full py-20 text-center">
                    <div className="bg-white inline-block p-10 rounded-3xl border border-dashed border-gray-300">
                        <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Courses Available</h3>
                        <p className="text-gray-500">Check back later for new learning opportunities.</p>
                    </div>
                </div>
            )}
        </div>
      </main>
    </div>
  );
}