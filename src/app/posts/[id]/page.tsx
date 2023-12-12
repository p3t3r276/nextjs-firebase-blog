'use client'
import { FC, useCallback, useEffect, useState } from "react";
import { collection, doc, getDoc, limit, onSnapshot, query } from "firebase/firestore";

import { Post, Tag } from '../../../utils/post.model'
import { db } from "@/db/firebase";
import { postCollection, tagCollection } from "@/utils/constants";
import { dateTransform } from "@/utils/dateTransform";
import { getPostById } from "@/utils/postsService";

interface pageProps {
  params: { id: string }
}

const Post: FC<pageProps> = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post>()

  const getPostData =useCallback(async (postId: string) => {
    await getPostById(postId)
  }, [])

  useEffect(() => {
    try {
      setLoading(true)
      getPostData(params.id)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!post && !loading) {
    return <p>Cannot find post</p>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <h2 className="text-4xl text-center mb-8">{post.title}</h2>
        <ul>
          {post.tags.map(tag => <li key={tag.id}>{tag.name}</li>)}
        </ul>
        <div dangerouslySetInnerHTML={{ __html: post.content }}>
        </div>
        <div className="mt-4">
          Created By: {post.createdBy?.name} at {dateTransform(post.createdAt)} <br /> 
          Updated By: {post.updatedBy?.name} at {dateTransform(post.updatedAt)}
        </div>
      </div>
    </main>
  )
}

export default Post;