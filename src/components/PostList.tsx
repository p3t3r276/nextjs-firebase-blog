'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { Post } from '@/utils/post.model';
import { collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/db/firebase';
import { postCollection } from '@/utils/constants';

export const PostList = () => {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const q = query(collection(db, postCollection))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let postArr: Post[] = [];

      querySnapshot.forEach((doc) => {
        postArr.push({ ...doc.data() as any, id: doc.id})
      })
      setPosts(postArr)
      return () => unsubscribe();
    })
  }, [])

  const removePost = async (id: string) => {
    await deleteDoc(doc(db, postCollection, id))
  }

  return (
    <div className='group flex flex-col gap-2 mt-4'>
      {posts.map((post, id) => (
        <div key={id} className='grid grid-cols-6 items-center'>
          <Link href={`/posts/${post.id}`} className='col-span-4 rounded-lg bg-slate-400 p-5 text-white my-2'>
            <h2>{post.title}</h2>
          </Link>
          <button
            className='col-span-1 rounded-lg bg-red-500 hover:bg-red-400 text-white p-5 text-xl'
            onClick={() => router.push(`/posts/edit/${post.id}`)}>Edit</button>
          <button
            className='col-span-1 rounded-lg bg-red-500 hover:bg-red-400 text-white p-5 text-xl'
            onClick={() => removePost(post.id)}>X</button>
        </div>
      ))}
    </div>
  )
}