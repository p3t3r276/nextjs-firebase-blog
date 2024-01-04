'use client'
import { FC } from "react"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from "next/navigation";

import { signInWithGoogle, signOut } from "@/db/auth"
import { BlogUser } from "@/utils/user.model";

interface NavBarProps {
  user: BlogUser | null
}

export const Navbar: FC<NavBarProps> = ({ user }) => {
  const router = useRouter();
  // const { user, googleSignIn, logOut } = UserAuth()
  // const handleSignIn = async () => {
  //   try {
  //     await googleSignIn()
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  // const handleSignOut = async () => {
  //   try {
  //     await logOut()
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  const handleSignIn = async () => {
    const isOk = await signInWithGoogle();

    if (isOk) router.refresh();
  };

  const handleSignOut = async () => {
    const isOk = await signOut();

    if (isOk) router.refresh();
  };
  
  return (
    <nav className="flex items-center justify-between bg-black text-white p-4">
      <div className="text-white text-xl font-semibold"><Link href={'/'}>
        NoteApp
      </Link></div>
      <div className="flex items-center">
        <div className="ml-4">
          <Link href={'/about'}>
            About
          </Link>
        </div>
        {user ? 
        (<>
          <div className="ml-4">
            <span>Welome, {user.name}</span>
          </div>
          <div className="ml-4">
            <Image src={user.photoURL as string} height={8} width={8} alt="User Photo" unoptimized className="h-8 w-8 rounded-full" />
          </div>
          <div className="ml-4">
            <button onClick={handleSignOut} >Log out</button>
          </div>
        </>) 
        : (
          <div className="ml-4">
            <button onClick={handleSignIn} >Sign In</button>
          </div>
        )}
      </div>
    </nav>
  )
}