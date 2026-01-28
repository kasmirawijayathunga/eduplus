import db from "@/config/db";
import { getUser } from "@/lib/dal";

export default async function CommunicationPage() {
    const user = await getUser();
    if (!user) return null;

    const announcements = await db.announcement.findMany({
        where: {
            course: {
                enrollments: {
                    some: { userId: user.id }
                }
            }
        },
        include: { course: true },
        orderBy: { createdAt: 'desc' }
    });

    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-8">Course Announcements</h1>
        
        <div className="max-w-4xl">
            <div className="space-y-6">
                {announcements.length === 0 && (
                    <div className="bg-white p-12 border rounded-xl text-center text-gray-500 shadow-sm">
                        No announcements found for your enrolled courses.
                    </div>
                )}
                {announcements.map((ann) => (
                    <div key={ann.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block mb-2">
                                    {ann.course.code} - {ann.course.title}
                                </span>
                                <h2 className="text-xl font-bold text-gray-900">{ann.title}</h2>
                                <p className="text-xs text-gray-400 mt-1">{new Date(ann.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{ann.content}</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    )
  }
  
