'use client'
import { FC, PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '@/db/firebase'

import { BlogUser } from "@/utils/user.model";

export const AuthContext  = createContext<any>({
  user: null,
  authLoading: false,
  googleSignIn: undefined,
  logOut: undefined
});

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<any>()
  const [authLoading, setAuthLoading] = useState(true)

  const googleSignIn = () => {
    setAuthLoading(true)
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  const logOut = () => {
    signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        setAuthLoading(false)
      } else {
        setUser(null)
        setAuthLoading(false)
      }
    })
    return () => unsubscribe();
  }, [user])

  return (<AuthContext.Provider value={{user, authLoading, googleSignIn, logOut }}>{children}</AuthContext.Provider>)
}

export const UserAuth = () => {
  return useContext(AuthContext)
}
