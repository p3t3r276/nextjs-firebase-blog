'use client'
import Link from 'next/link'
import { PostList } from "../components/PostList";
import { UserAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function Home() {
  const { user } = UserAuth()

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    checkAuthentication()
  }, [user])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full font-mono text-sm">
        <h1 className="text-center text-4xl">Notes</h1>
        <p className="text-center text-2xl">Taking note the new way.</p>
        <div className='mt-4'>
          {user && (
            <>
              <Link href={'/posts/edit/new'} className='text-white border-2 border-slate-900 bg-slate-950 hover:bg-slate-800 p-3 text-xl rounded-lg' >
                New Post
              </Link>
              <PostList />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
