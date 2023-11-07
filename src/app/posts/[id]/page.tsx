'use client'
import { FC, useEffect, useState } from "react";
import { Post } from '../../../utils/post.model'
import { db } from "@/db/firebase";
import { doc, getDoc } from "firebase/firestore";
import { postCollection } from "@/utils/constants";

interface pageProps {
  params: { id: string }
}

const Post: FC<pageProps> = ({ params }) => {
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post>()
  useEffect(() => {
    async function getPostById(id: string) {
      const snapshot = await getDoc(doc(db, postCollection, params.id))
      if (snapshot.exists()) { 
          setPost({ ...snapshot.data() as any, id: snapshot.id  })
       }
    }
    try {
      setLoading(true)
      getPostById(params.id)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false);
    }
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!post) {
    return <p>Cannot find post</p>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm lg:flex">
        <h2 className="text-4xl text-center mb-4">{post.title}</h2>
        <div>
          {post.content}
        </div>
      </div>
    </main>
  )
}

export default Post;