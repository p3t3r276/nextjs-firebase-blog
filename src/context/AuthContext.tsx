'use client'
import { FC, PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider, User } from 'firebase/auth'
import { auth } from '@/db/firebase'

export const AuthContext  = createContext<any>(null);

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>()

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  const logOut = () => {
    signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe();
  }, [user])

  return (<AuthContext.Provider value={{user, googleSignIn, logOut }}>{children}</AuthContext.Provider>)
}

export const UserAuth = () => {
  return useContext(AuthContext)
}
