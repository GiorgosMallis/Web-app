import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '../contexts/AuthContext'
import { NotesProvider } from '../contexts/NotesContext'
import { ThemeProvider } from '../contexts/ThemeContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notes App',
  description: 'A simple note-taking application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full transition-colors duration-200`}>
        <AuthProvider>
          <ThemeProvider>
            <NotesProvider>
              <main className="min-h-screen dark:bg-gray-900">
                {children}
              </main>
            </NotesProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
