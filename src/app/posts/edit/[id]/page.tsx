'use client'
import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { Form } from "@/components/postForm";
import { useRouter } from "next/navigation";
import { Post } from "@/utils/post.model";
import { Timestamp, addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";

import { db } from "@/db/firebase";
import { postCollection } from "@/utils/constants";

interface pageProps {
  params: { id: string }
}

const EditPost: FC<pageProps> = ({ params }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post>();
  const [mode, setMode] = useState('new')

  useEffect(() => {
    async function getPostById(id: string) {
      const snapshot = await getDoc(doc(db, postCollection, params.id))
      if (snapshot.exists()) { 
          setPost({ ...snapshot.data() as any, id: snapshot.id  })
       }
    }
    
    if (params.id === 'new') {  
      setMode('new')
      const newDate  = Timestamp.fromDate(new Date())
      setPost({ id: "", title: '', content: '', createdAt: newDate, updatedAt: newDate })
    } else {
      setMode('edit');
      try {
        setLoading(true)
        getPostById(params.id)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false);
      }
    }
  }, [])
  
  function handleChange(e: ChangeEvent<HTMLInputElement> | 
    ChangeEvent<HTMLTextAreaElement>) {
      setPost({ ...post, [e.target.name]: e.target.value } as any);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (post) {
      if (mode == 'new') {
        await addDoc(collection(db, postCollection), post)
        router.push('/')
      } else {
        const updatePost = async (post: Post) => {
          await updateDoc(doc(db, postCollection, post.id), {
            title: post.title,
            content: post.content,
            updatedAt: Timestamp.fromDate(new Date())
          })
        }
        updatePost(post)
        router.push('/')      
      }
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm lg:flex">
      <h2 className='text-center text-4xl'>{mode === 'new' ? 'New Post' : 'Edit Post'}</h2>
        <Form post={post} handleChange={handleChange} handleSubmit={handleSubmit} />
      </div>
    </main>
  )
}

export default EditPost;