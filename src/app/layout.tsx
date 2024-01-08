import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { getCurrentUser } from '@/db/firebaseAdmin'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notetaking app',
  description: 'Writing notes the new way',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser();
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-100`}>
        <Navbar user={currentUser} />
        {children}
      </body>
    </html>
  )
}
