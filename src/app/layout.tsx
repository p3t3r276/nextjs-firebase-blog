import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthContextProvider } from '@/context/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notetaking app',
  description: 'Writing notes the new way',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </body>
    </html>
  )
}
