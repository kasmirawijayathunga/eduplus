import { getConversations, getMessagesWithUser, getAvailableContacts, getUserProfile } from "@/lib/dal"
import Messaging from "@/components/Messaging"
import { notFound } from "next/navigation"

export default async function InstructorMessagesPage({ 
    searchParams 
}: { 
    searchParams: Promise<{ user?: string }> 
}) {
    const { user: selectedUserId } = await searchParams
    
    // Use getUserProfile to get the full role as string and other details
    const userProfile = await getUserProfile()
    if (!userProfile) return notFound()

    const [conversations, contacts] = await Promise.all([
        getConversations(),
        getAvailableContacts()
    ])

    const messages = selectedUserId 
        ? await getMessagesWithUser(selectedUserId) 
        : []

    // Adapt userProfile to the format expected by Messaging component
    const currentUser = {
        id: userProfile.id,
        name: userProfile.name,
        email: userProfile.email,
        role: userProfile.role
    }

    // Adapt conversations and contacts too
    const adaptedConversations = conversations.map(c => ({
        ...c,
        otherUser: {
            ...c.otherUser,
            role: c.otherUser.role
        },
        lastMessage: {
            ...c.lastMessage,
            createdAt: new Date(c.lastMessage.createdAt)
        }
    }))

    const adaptedContacts = contacts.map(c => ({
        ...c,
        role: c.role
    }))

    const adaptedMessages = messages.map(m => ({
        ...m,
        createdAt: new Date(m.createdAt)
    }))

    return (
        <div className="container mx-auto p-6 flex flex-col h-full">
            <h1 className="text-2xl font-bold mb-6">Instructor Messages</h1>
            <Messaging 
                currentUser={currentUser}
                initialConversations={adaptedConversations}
                availableContacts={adaptedContacts}
                initialMessages={adaptedMessages}
                selectedUserId={selectedUserId}
            />
        </div>
    )
}
