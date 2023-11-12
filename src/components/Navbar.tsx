import { FC } from "react"
import Image from 'next/image'

import { BlogUser } from "@/utils/user.model"

interface pageProps {
  user?: BlogUser,
  handleSignIn: () => void,
  handleSignOut: () => void
}

export const Navbar: FC<pageProps> = ({ user, handleSignIn, handleSignOut }) => {
  return (
    <div className="flex justify-between items-center h-16 mx-auto px-4 text-white bg-black">
      <h1 className="w-full text-3xl font-bold">NoteApp</h1>
      <ul className="flex">
        {user 
        ? (<>
            <li className="p-4">
              <span>Welcome, {user.name}</span>
              {user.photoURL ? (<Image src={user.photoURL} className="w-8 h-8 rounded-full" width={30} height={30} alt="" />): (<span>hahah</span>)}
            </li>
            <li className="p-4"><button onClick={handleSignOut} >Logout</button></li>
          </>)
        : (<li className="p-4"><button onClick={handleSignIn} >Login</button></li>)}
        
      </ul>
    </div>
  )
}