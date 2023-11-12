'use client'
import { FC, PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User } from 'firebase/auth'
import { auth } from '@/db/firebase'
import { BlogUser } from "@/utils/user.model";

export const AuthContext  = createContext<any>(null);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<BlogUser | null>()

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  const logOut = () => {
    signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser?.uid,
          email: currentUser?.email,
          name: currentUser?.displayName,
          photoURL: currentUser?.photoURL 
        })
      }
    })
    return () => unsubscribe();
  }, [user])

  return (<AuthContext.Provider value={{user, googleSignIn, logOut }}>{children}</AuthContext.Provider>)
}

export const UserAuth = () => {
  return useContext(AuthContext)
}
