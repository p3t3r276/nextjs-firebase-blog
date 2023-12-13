'use client'
import { FC, FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Timestamp } from "firebase/firestore";

import { UserAuth } from "@/context/AuthContext";
import { EmptyPost, Post, Tag } from "@/utils/post.model";
import { BlogUser } from "@/utils/user.model";
import { Form } from "@/components/postForm";
import { createPost, getPostById, updatePost } from "@/utils/postsService";
import { getAllTags } from "@/utils/tagsService";

interface pageProps {
  params: { id: string }
}

const EditPost: FC<pageProps> = ({ params }) => {
  const { user } = UserAuth()
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post>();
  const [mode, setMode] = useState('new')
  const [tags, setTags] = useState<Tag[]>([])

  const getData = useCallback(async (postId: string) => {
    if (params.id === 'new') {  
      setMode('new')
      const newDate  = Timestamp.fromDate(new Date())
      const currentBlogUser: BlogUser = {
        id: user?.id,
        name: user?.name,
        email: user?.email
      }
      setPost(EmptyPost(currentBlogUser, newDate))
    } else {
      setMode('edit');
      try {
        setLoading(true)
        const postData  = await getPostById(postId);
        if (postData) {
          setPost(postData)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false);
      }
    }
  }, [])

  const getAllTagsCallback = useCallback(async () => {
    const allTags = await getAllTags()
    setTags(allTags)
  }, [tags])

  useEffect(() => {
    getData(params.id)
    getAllTagsCallback()
  }, [])
  
  function handleChange(name: string, value: any) {
    setPost({ ...post, [name]: value } as any);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post) {
        if (mode == 'new') {
          await createPost(post, tags)
          router.push('/')
        } else {
          await updatePost(post, tags, user)
          router.push('/')      
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-8xl w-full font-mono text-sm">
        <h2 className='text-center text-4xl'>{mode === 'new' ? 'New Post' : 'Edit Post'}</h2>
        <Form post={post} handleChange={handleChange} handleSubmit={handleSubmit} tags={tags} />
      </div>
    </main>
  )
}

export default EditPost;