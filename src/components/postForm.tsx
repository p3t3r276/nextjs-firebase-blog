import { blogPostsData } from "@/utils/blogPost.data";
import { Post } from "@/utils/post.model";
import { FC, FormEvent, useEffect, useState } from "react";

interface pageProps {
  post?: Post,
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
  handleChange: (e: any) => void
}

export const Form: FC<pageProps> = ({ post, handleChange, handleSubmit }) => {
  const [currentPost, setcurrentPost] = useState<Post>({ id: '0', title: '',  content: '' })

  useEffect(() => {
    if (post) {
      setcurrentPost(currentPost)
    }
  }, [])
  
  return (
    <>
      <h2 className='text-center text-4xl'>{post?.id === 'new' ? 'New Post' : 'Edit Post'}</h2>
      <div>
        <form className="items-center mt-4" onSubmit={handleSubmit}>
          <div>
            <input 
              type="text" 
              name= 'title'
              className="block p-3 rounded-lg border w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
              onChange={handleChange}
              value={currentPost.title}
              placeholder="Title" />
          </div>
          <div>
            <textarea  
              name= 'content'
              className="block p-2.5 mt-4 w-full rounded-lg border border-gray-300 focus:ring-blue-500"
              onChange={handleChange}
              value={currentPost.content} 
              placeholder="Content"></textarea>
          </div>
          <div>
            <button 
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl rounded-lg'
              type="submit">Post</button>
          </div>
        </form>
      </div>
    </>
  )
}