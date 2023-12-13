'use client'
import { FC, useCallback, useEffect, useState } from "react";

import { Post } from '../../../utils/post.model'
import { dateTransform } from "@/utils/dateTransform";
import { getPostById } from "@/utils/postsService";

interface pageProps {
  params: { id: string }
}

const Post: FC<pageProps> = ({ params }) => {
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<Post | null>()

  const getPostData = useCallback(async (postId: string) => {
    return await getPostById(postId)
  }, [])

  useEffect(() => {
    try {
      setLoading(true)
      getPostData(params.id).then(data => {
        setPost(data)
      })
      .catch(err => console.error(err))
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
        {post ? (
          <>
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
          </>
        ) : ''}
      </div>
    </main>
  )
}

export default Post;