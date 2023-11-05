'use client'
import { Form } from '@/components/postForm';
import { blogPostsData } from '@/utils/blogPost.data';
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useState } from 'react';

export default function NewPost () {
  const router = useRouter()

  const [post, setPost] = useState({
    title: "",
    content: "",
  });

  function handleChange(e: ChangeEvent<HTMLInputElement> | 
    ChangeEvent<HTMLTextAreaElement>) {
      setPost({ ...post, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const lastPost = blogPostsData[blogPostsData.length - 1]
    blogPostsData.push({ ...post, id: lastPost.id + 1});
    router.push('/')
  }

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm lg:flex">
      <Form handleChange={handleChange} handleSubmit={handleSubmit} />
    </div>
    </main>
  )
}