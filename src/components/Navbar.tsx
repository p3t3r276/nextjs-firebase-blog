'use client'
import { FC } from "react"
import Image from 'next/image'

import { UserAuth } from "@/context/AuthContext"

export const Navbar: FC = () => {
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
  return (
    <nav className="flex items-center justify-between bg-black text-white p-4">
      <div className="text-white text-xl font-semibold">NoteApp</div>
      <div className="flex items-center">
        {user ? 
        (<>
          <div className="ml-4">
            <span>Welome, {user.displayName}</span>
          </div>
          <div className="ml-4">
            <img src={user.photoURL} alt="User Photo" className="h-8 w-8 rounded-full" />
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