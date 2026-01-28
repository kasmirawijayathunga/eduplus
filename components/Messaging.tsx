'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { sendMessage, markMessagesAsRead } from '@/app/portal/actions'

type User = {
    id: string
    name: string | null
    email: string
    role: string
}

type Message = {
    id: string
    senderId: string
    receiverId: string
    content: string
    read: boolean
    createdAt: Date
}

type Conversation = {
    otherUser: User
    lastMessage: Message
    unreadCount: number
}

interface MessagingProps {
    currentUser: User
    initialConversations: Conversation[]
    availableContacts: User[]
    initialMessages: Message[]
    selectedUserId?: string
}

export default function Messaging({ 
    currentUser, 
    initialConversations, 
    availableContacts,
    initialMessages,
    selectedUserId: initialSelectedUserId
}: MessagingProps) {
    const [selectedUserId, setSelectedUserId] = useState<string | undefined>(initialSelectedUserId)
    const [messages, setMessages] = useState<Message[]>(initialMessages)
    const [content, setContent] = useState('')
    const [isSending, setIsSending] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const pathname = usePathname()

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Update messages when initialMessages change (from server)
    useEffect(() => {
        setMessages(initialMessages)
        
        // Mark messages as read if we have a selected user AND there are unread messages
        const hasUnread = initialMessages.some(m => m.receiverId === currentUser.id && !m.read)
        if (initialSelectedUserId && hasUnread) {
            markMessagesAsRead(initialSelectedUserId)
        }
    }, [initialMessages, initialSelectedUserId, currentUser.id])

    // Update internal selection when prop changes
    useEffect(() => {
        setSelectedUserId(initialSelectedUserId)
    }, [initialSelectedUserId])

    const handleSelectUser = (userId: string) => {
        router.push(`${pathname}?user=${userId}`)
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || !selectedUserId || isSending) return

        setIsSending(true)
        try {
            await sendMessage(selectedUserId, content)
            setContent('')
            // Optimistic update would be better here, 
            // but for now we rely on server revalidation
        } catch (error) {
            console.error('Failed to send message:', error)
        } finally {
            setIsSending(false)
        }
    }

    const selectedUser = availableContacts.find(u => u.id === selectedUserId) || 
                         initialConversations.find(c => c.otherUser.id === selectedUserId)?.otherUser

    return (
        <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl shadow-sm border overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <h2 className="font-bold text-lg">Messages</h2>
                    <button className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {initialConversations.length === 0 && (
                        <div className="p-8 text-center text-gray-400">
                             No conversations yet.
                        </div>
                    )}
                    {initialConversations.map(conv => (
                        <button
                            key={conv.otherUser.id}
                            onClick={() => handleSelectUser(conv.otherUser.id)}
                            className={`w-full p-4 flex items-center gap-3 border-b hover:bg-gray-50 transition-colors ${selectedUserId === conv.otherUser.id ? 'bg-indigo-50 border-r-4 border-r-indigo-600' : ''}`}
                        >
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500">
                                {conv.otherUser.name?.charAt(0) || conv.otherUser.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 text-left">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-medium text-sm truncate max-w-[120px]">
                                        {conv.otherUser.name || conv.otherUser.email}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                    {conv.lastMessage.senderId === currentUser.id ? 'You: ' : ''}{conv.lastMessage.content}
                                </p>
                            </div>
                            {conv.unreadCount > 0 && (
                                <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col bg-gray-50">
                {selectedUserId ? (
                    <>
                        <div className="p-4 border-b bg-white flex items-center gap-3">
                             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-bold text-indigo-600">
                                {selectedUser?.name?.charAt(0) || selectedUser?.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold">{selectedUser?.name || selectedUser?.email}</h3>
                                <p className="text-xs text-gray-500">{selectedUser?.role}</p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg: Message) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[70%] p-3 rounded-lg text-sm ${
                                        msg.senderId === currentUser.id 
                                            ? 'bg-indigo-600 text-white rounded-br-none' 
                                            : 'bg-white border rounded-bl-none'
                                    }`}>
                                        <p>{msg.content}</p>
                                        <p className={`text-[10px] mt-1 ${msg.senderId === currentUser.id ? 'text-indigo-100' : 'text-gray-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
                            <input 
                                type="text"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <button 
                                type="submit"
                                disabled={!content.trim() || isSending}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                Send
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-center items-center justify-center text-gray-400 flex-col gap-4">
                        <svg className="w-16 h-16 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        <p>Select a conversation to start messaging</p>
                        
                        <div className="w-full max-w-md px-4">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Available Contacts</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {availableContacts.slice(0, 6).map(u => (
                                    <button 
                                        key={u.id}
                                        onClick={() => handleSelectUser(u.id)}
                                        className="p-2 border rounded-lg bg-white hover:bg-gray-50 text-xs text-left truncate flex items-center gap-2"
                                    >
                                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-400 text-[10px]">
                                            {u.name?.charAt(0) || u.email.charAt(0).toUpperCase()}
                                        </div>
                                        {u.name || u.email}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
