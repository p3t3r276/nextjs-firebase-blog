'use client'
import Link from 'next/link'
import Image from 'next/image'
import { PostList } from "../components/PostList";
import { UserAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  const { user, googleSignIn, logOut } = UserAuth()
  const handleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSignOut = async () => {
    try {
      await logOut()
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    checkAuthentication()
  }, [user])

  return (
    <>
    <Navbar user={user} handleSignIn={handleSignIn} handleSignOut={handleSignOut} />
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm lg:flex">
        <h1 className="text-center text-4xl">Notes</h1>
        <p className="text-center text-xl">Taking note the new way.</p>
        <div>
          {!user 
          ? <button onClick={handleSignIn}>Login</button>
          : (
            <>
              <Link href={'/posts/edit/new'} className='text-white border-2 border-slate-900 bg-slate-950 hover:bg-slate-900 p-3 text-xl' >
                New Post
              </Link>
              <PostList />
            </>
          )}
        </div>
      </div>
    </main>
    </>
  );
}
