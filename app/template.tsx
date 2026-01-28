'use client'

import React from 'react'
import { SnackbarProvider } from 'notistack'

function Template({ children }: { children: React.ReactNode }) {
  return (
        <SnackbarProvider style={{ maxWidth: 450 }} maxSnack={3}>
            {children}
        </SnackbarProvider>
  )
}

export default Template