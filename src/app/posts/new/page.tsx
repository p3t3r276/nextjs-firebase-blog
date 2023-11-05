'use client'
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

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const lastPost = blogPostsData[blogPostsData.length - 1]
    blogPostsData.push({ ...post, id: lastPost.id + 1});
    router.push('/')
  }

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm lg:flex">
      <h2 className='text-center text-4xl'>New Post</h2>
      <div>
        <form className="items-center mt-4">
          <div>
            <input 
              type="text" 
              name= 'title'
              className="block p-3 rounded-lg border w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
              onChange={handleChange}
              value={post.title}
              placeholder="Title" />
          </div>
          <div>
            <textarea  
              name= 'content'
              className="block p-2.5 mt-4 w-full rounded-lg border border-gray-300 focus:ring-blue-500"
              onChange={handleChange}
              value={post.content} 
              placeholder="Content"></textarea>
          </div>
          <div>
            <button 
              onClick={(e) => handleSubmit(e)} 
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl rounded-lg'
              type="submit">Post</button>
          </div>
        </form>
      </div>
    </div>
    </main>
  )
}