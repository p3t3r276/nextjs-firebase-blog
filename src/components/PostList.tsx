'use client'
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { AiTwotoneEdit } from 'react-icons/ai'
import { FaTrashAlt } from 'react-icons/fa'

import { Post } from '@/utils/post.model';
import { durationFromNow } from '@/utils/dateTransform';
import { getAllPosts, removePostById } from '@/utils/postsService';

export const PostList = () => {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    getPost().then(data => { 
      console.log(data)
      setPosts(data) }).catch(error => console.error(error))
  }, [])

  const getPost = useCallback(async () => {
    return getAllPosts()
  }, [])

  const removePost = useCallback(async (postId: string) => {
    await removePostById(postId)
  }, [])

  return (
    <div className='group flex flex-col gap-2 mt-4'>
      {posts.map((post, id) => (
        <div key={id} className='grid grid-cols-6 items-center'>
          <Link href={`/posts/${post.id}`} className='col-span-4 rounded-l-lg bg-slate-400 p-5 text-white my-2'>
            <h2>{post.title}</h2>
            <div>Author: {post.createdBy?.name}</div>
            <div>Edited by: {post.updatedBy?.name} {durationFromNow(post.updatedAt)}</div>
          </Link>
          <button
            className='flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white text-xl p-10'
            onClick={() => router.push(`/posts/edit/${post.id}`)}>
              <AiTwotoneEdit />
              <span className='sr-only'>Edit</span> 
            </button>
          <button
            className='flex items-center justify-center rounded-r-lg bg-red-500 hover:bg-red-400 text-white text-xl p-10'
            onClick={() => removePost(post.id)}>
              
              <FaTrashAlt />
              <span className='sr-only'>Delete</span>
          </button>
        </div>
      ))}
    </div>
  )
}

