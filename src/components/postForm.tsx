import { FC, FormEvent } from "react";
import { dateTransform } from "@/utils/dateTransform";
import { Post } from "@/utils/post.model";

interface pageProps {
  post?: Post,
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
  handleChange: (e: any) => void
}

export const Form: FC<pageProps> = ({ 
  post, 
  handleChange, 
  handleSubmit }) => {
  
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
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl rounded-lg'
              type="submit">Post</button>
          </div>
        </form>
        <div>
          Created By: at {dateTransform(post.createdAt)} <br /> Updated By: at {dateTransform(post.updatedAt)}
        </div>
      </div>)
    : ''}
    </>
  )
}