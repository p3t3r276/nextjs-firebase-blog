'use client'
import { FC, useEffect, useState } from "react";
import { collection, doc, getDoc, limit, onSnapshot, query } from "firebase/firestore";

import { Post, Tag } from '../../../utils/post.model'
import { db } from "@/db/firebase";
import { postCollection, tagCollection } from "@/utils/constants";
import { dateTransform } from "@/utils/dateTransform";

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
        const postData: Post = snapshot.data() as any;
        postData.id = snapshot.id
        
        // get tags data
        // Query the tags subcollection
        const tagsQuerySnapshot = query(collection(db, `${postCollection}/${snapshot.id}/${tagCollection}`))
        
        const unsubscribe = onSnapshot(tagsQuerySnapshot, (querySnapshot) => {
          let tags: Tag[] = [];
          querySnapshot.forEach(doc => {
            tags.push({ ...doc.data() as any, id: doc.id})
          })
          setPost({ ...snapshot.data() as any, id: snapshot.id, tags  })
          return () => unsubscribe()
        })        
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