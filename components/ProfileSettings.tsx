'use client'

import React, { useState, useEffect } from 'react'
import { updateUserProfile } from '@/app/portal/actions'

type UserProfile = {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: Date
}

export default function ProfileSettings({ 
    user, 
    logoutAction 
}: { 
    user: UserProfile,
    logoutAction: () => Promise<void>
}) {
    const [name, setName] = useState(user.name || '')
    const [isSaving, setIsSaving] = useState(false)
    const [notifications, setNotifications] = useState({
        assignments: true,
        grades: true,
        weeklyReport: false
    })

    // Load notifications from local storage on mount
    useEffect(() => {
        const savedNotifications = localStorage.getItem('user_notifications')
        if (savedNotifications) {
            try {
                setNotifications(JSON.parse(savedNotifications))
            } catch (e) {
                console.error("Failed to parse notifications from local storage")
            }
        }
    }, [])

    // Save notifications to local storage whenever they change
    const handleNotificationChange = (key: keyof typeof notifications) => {
        const updated = { ...notifications, [key]: !notifications[key] }
        setNotifications(updated)
        localStorage.setItem('user_notifications', JSON.stringify(updated))
    }

    const handleSaveName = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim() || isSaving) return

        setIsSaving(true)
        try {
            await updateUserProfile({ name })
        } catch (error) {
            console.error('Failed to update profile:', error)
            alert('Failed to update profile.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="w-full md:w-2/3 space-y-6">
            <section className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                <form onSubmit={handleSaveName} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input 
                                name="name"
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border rounded p-2 focus:ring-2 focus:ring-indigo-500 outline-none" 
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Email (Read Only)</label>
                            <input 
                                type="email" 
                                defaultValue={user.email} 
                                className="w-full border rounded p-2 bg-gray-50 text-gray-400 cursor-not-allowed" 
                                readOnly 
                                disabled 
                            />
                        </div>
                    </div>
                    <div className="flex justify-end items-center">
                        <button 
                            type="submit" 
                            disabled={isSaving || !name.trim()}
                            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </section>
        
            {user.role === 'STUDENT' && (
                <section className="bg-white rounded-xl p-6 shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Notifications</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label htmlFor="notify-assignments" className="text-sm cursor-pointer">Email me about new assignments</label>
                            <input 
                                id="notify-assignments"
                                type="checkbox" 
                                checked={notifications.assignments}
                                onChange={() => handleNotificationChange('assignments')}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="notify-grades" className="text-sm cursor-pointer">Email me when grades are posted</label>
                            <input 
                                id="notify-grades"
                                type="checkbox" 
                                checked={notifications.grades}
                                onChange={() => handleNotificationChange('grades')}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="notify-weekly" className="text-sm cursor-pointer">Weekly progress report</label>
                            <input 
                                id="notify-weekly"
                                type="checkbox" 
                                checked={notifications.weeklyReport}
                                onChange={() => handleNotificationChange('weeklyReport')}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </section>
            )}

            <section className="bg-white rounded-xl p-6 shadow-sm border">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
                    <div className="flex flex-col items-end">
                        <p className="text-xs text-gray-400 mb-2">End your current session</p>
                        <form action={logoutAction}>
                            <button className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded text-sm font-bold hover:bg-red-100 transition-colors">
                                Sign Out
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    )
}
