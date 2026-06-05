'use client'
import { FC, useCallback } from "react"
import Link from "next/link"
import { FaTrashAlt } from 'react-icons/fa'
import { AiTwotoneEdit } from 'react-icons/ai'

import { Post } from "@/utils/post.model"
import { removePostById } from "@/utils/postsService"
import { durationFromNow } from "@/utils/dateUtils"

interface PostItemPageProps {
  post: Post
}

export const PostItem: FC<PostItemPageProps> = ({ post }) => {
  const removePost = useCallback(async (postId: string) => {
    await removePostById(postId)
  }, [])

  return (
    <div key={post.id} className='grid grid-cols-6 items-center'>
      <Link href={`/posts/${post.id}`} className='col-span-4 rounded-l-lg bg-slate-400 p-3 text-white my-2'>
        <h2 className="text-xl font-bold uppercase">{post.title}</h2>
        <p className="text-xs">Author: {post.createdBy?.name}</p>
        <p className="text-xs">Edited by: {post.updatedBy?.name} {durationFromNow(post.updatedAt)}</p>
      </Link>
      <Link
        className='flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white text-xl p-8'
        href={`/posts/edit/${post.id}`}>
          <AiTwotoneEdit />
          <span className='sr-only'>Edit</span> 
        </Link>
      <button
        className='flex items-center justify-center rounded-r-lg bg-red-500 hover:bg-red-400 text-white text-xl p-8'
        onClick={() => removePost(post.id)}>
          <FaTrashAlt />
          <span className='sr-only'>Delete</span>
      </button>
    </div>
    
  )
}
