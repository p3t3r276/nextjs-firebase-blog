import { ChangeEvent, FC, FormEvent } from "react";
import dynamic from "next/dynamic";

import { dateTransform } from "@/utils/dateTransform";
import { Post } from "@/utils/post.model";

interface pageProps {
  post?: Post,
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
  handleChange: (name: string, value: any) => void
}

const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

export const Form: FC<pageProps> = ({ 
  post, 
  handleChange, 
  handleSubmit }) => {

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value)
  }

  const handleEditor = (value: any) => handleChange('content', value)
  
  return (
    <>
    {post ?
      (<div>
        <form className="items-center mt-4" onSubmit={handleSubmit}>
          <div>
            <input 
              type="text" 
              name= 'title'
              className="block p-3 rounded-lg border w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
              onChange={handleInput}
              value={post.title}
              placeholder="Title" />
          </div>
          <div className="mt-4">
            <Editor
              value={post.content}
              onChange={handleEditor}
            />
          </div>
          <div>
            <button 
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl rounded-lg'
              type="submit">Post</button>
          </div>
        </form>
        <div>
          Created By: {post.createdBy?.name} at {dateTransform(post.createdAt)} <br /> 
          Updated By: {post.updatedBy?.name} at {dateTransform(post.updatedAt)}
        </div>
      </div>)
    : ''}
    </>
  )
}