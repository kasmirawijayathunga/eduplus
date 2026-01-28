'use server'

import { cookies } from 'next/headers'
import { AuthUser } from '@/services/Auth'

export async function createSession(sessionData: AuthUser) {
  const expiresAt = new Date(sessionData.access.expire)
  const cookieStore = await cookies()
 
  cookieStore.set('session', JSON.stringify(sessionData), {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('session')?.value
  if (!cookie) return null

  const session: AuthUser = JSON.parse(cookie)
  return session
}