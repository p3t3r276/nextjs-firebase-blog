'use client'
import { FC, PropsWithChildren, createContext, useContext, useState, useEffect } from "react";
import { signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth'
import { useRouter } from "next/navigation";
import { auth } from '@/db/firebase'
import { BlogUser } from "@/utils/user.model";

export const AuthContext  = createContext<{
  user: BlogUser | null,
  authLoading: boolean,
  googleSignIn: () => void,
  logOut: () => void
}>({
  user: null,
  authLoading: false,
  googleSignIn: () => {},
  logOut: () => {}
});

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<any>()
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter();

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
        let blogUser: BlogUser = { id: currentUser.uid,
          name: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL }
        setUser(blogUser)
        setAuthLoading(false)
      } else {
        setUser(null)
        setAuthLoading(false)
      }
    })
    return () => unsubscribe();
  }, [])

  useEffect(() => {
    onAuthStateChanged(auth, async authUser => {
      if (user === undefined) return;
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
}, [user]);

  return (<AuthContext.Provider value={{user, authLoading, googleSignIn, logOut }}>{children}</AuthContext.Provider>)
}

export const UserAuth = () => {
  return useContext(AuthContext)
}
