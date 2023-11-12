'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { AiTwotoneEdit } from 'react-icons/ai'
import { FaTrashAlt } from 'react-icons/fa'

import { Post } from '@/utils/post.model';
import { db } from '@/db/firebase';
import { postCollection } from '@/utils/constants';
import { durationFromNow } from '@/utils/dateTransform';

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
            <div>Author: {post.createdBy?.name}</div>
            <div>Edited by: {post.updatedBy?.name} {durationFromNow(post.updatedAt)}</div>
          </Link>
          <button
            className='flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-400 text-white text-xl h-24'
            onClick={() => router.push(`/posts/edit/${post.id}`)}>
              <AiTwotoneEdit />
              <span className='sr-only'>Edit</span> 
            </button>
          <button
            className='flex items-center justify-center rounded-lg bg-red-500 hover:bg-red-400 text-white text-xl h-24'
            onClick={() => removePost(post.id)}>
              
              <FaTrashAlt />
              <span className='sr-only'>Delete</span>
          </button>
        </div>
      ))}
    </div>
  )
}