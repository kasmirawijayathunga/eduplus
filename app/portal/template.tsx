'use client'

import React from 'react'
import AuthManager from '@/components/AuthManager'

function Template({ children }: { children: React.ReactNode }) {
  return (
      <AuthManager>{children}</AuthManager>
  )
}

export default Template