import AuthManager from "@/components/AuthManager";
import { logout } from "@/services/AuthSSR";
import { getUserProfile } from "@/lib/dal";
import ProfileSettings from "@/components/ProfileSettings";

export default async function ProfilePage() {
    const user = await getUserProfile();

    const initials = user.name 
        ? user.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : user.email[0].toUpperCase();

    const formattedDate = new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        year: 'numeric' 
    }).format(new Date(user.createdAt));

    return (
        <AuthManager>
            <div className="container mx-auto py-10 px-4 md:px-6">
                <h1 className="text-3xl font-bold mb-8">My Profile</h1>
                
                <div className="flex flex-col md:flex-row gap-8">
                    {/* User Info Card */}
                    <div className="w-full md:w-1/3">
                        <div className="bg-white rounded-xl p-6 shadow-sm border text-center">
                            <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-indigo-600 mb-4">
                                {initials}
                            </div>
                            <h2 className="text-xl font-bold">{user.name || 'User'}</h2>
                            <p className="text-gray-500">ID: {user.id}</p>
                            <p className="text-sm text-indigo-600 mt-1 capitalize">{user.role.toLowerCase()}</p>
                            
                            <div className="mt-6 border-t pt-6 text-left space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Email</span>
                                    <span className="font-medium">{user.email}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="font-medium">{formattedDate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings & Notifications (Client Side) */}
                    <ProfileSettings user={user} logoutAction={logout} />
                </div>
            </div>
      </AuthManager>
    )
}
