'use client'
import { FC, useCallback } from "react"
import Link from "next/link"
import { FaTrashAlt } from 'react-icons/fa'
import { AiTwotoneEdit } from 'react-icons/ai'

import { Post } from "@/utils/post.model"
import { removePostById } from "@/utils/postsService"

interface PostItemPageProps {
  post: Post
}

export const PostItem: FC<PostItemPageProps> = ({ post }) => {
  const removePost = useCallback(async (postId: string) => {
    await removePostById(postId)
  }, [])

  return (
    <div key={post.id} className='grid grid-cols-6 items-center'>
      <Link href={`/posts/${post.id}`} className='col-span-4 rounded-l-lg bg-slate-400 p-5 text-white my-2'>
        <h2>{post.title}</h2>
        <div>Author: {post.createdBy?.name}</div>
        <div>Edited by: {post.updatedBy?.name} {JSON.stringify(post.updatedAt)}</div>
      </Link>
      <Link
        className='flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white text-xl p-10'
        href={`/posts/edit/${post.id}`}>
          <AiTwotoneEdit />
          <span className='sr-only'>Edit</span> 
        </Link>
      <button
        className='flex items-center justify-center rounded-r-lg bg-red-500 hover:bg-red-400 text-white text-xl p-10'
        onClick={() => removePost(post.id)}>
          <FaTrashAlt />
          <span className='sr-only'>Delete</span>
      </button>
    </div>
    
  )
}