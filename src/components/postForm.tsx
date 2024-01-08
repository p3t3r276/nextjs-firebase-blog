'use client'
import { ChangeEvent, FC, FormEvent, useState, useId } from "react";
import dynamic from "next/dynamic";
import CreatableSelect from 'react-select/creatable';

import { Post, Tag } from "@/utils/post.model";
import { Item } from "@/utils/item.model";

interface pageProps {
  postProp: Post,
  tags: Tag[]
}

const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

export const Form: FC<pageProps> = ({ 
  postProp,
  tags }) => {

  const [post, setPost] = useState(postProp) 

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost({...post, [e.target.name]: e.target.value })
  }

  const handleEditor = (value: any) => { 
    setPost({...post, content: value })
  }
  const handleSlection = (value: any) => {
    let valueToSubmit: Tag[] = (value as Item[]).map(item => Object.assign({ id: item.value, name: item.label }, {}))
    setPost({...post, tags: valueToSubmit })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(post)
  }

  const selectItems: Item[] = tags.map(t => Object.assign({ value: t.id, label: t.name }, {}))
  const defaultValue = post && post.tags.length > 0 ? post.tags.map(t => Object.assign({ value: t.id, label: t.name }, {})) : []
  return (
    <>
    {post ?
      (<div>
        <form className="items-center mt-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <input 
                type="text" 
                name= 'title'
                className="block p-3 rounded-lg border w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                onChange={handleInput}
                value={post.title}
                placeholder="Title" />
                <div className="mt-4">
                  <Editor
                    value={post.content}
                    onChange={handleEditor}
                  />
                </div>
            </div>
            <div className="col-span-1">
              {/* upload image button */}
              {/* display image */}
              <div>
                <CreatableSelect 
                  options={selectItems} 
                  isMulti={true}
                  name="tags"
                  onChange={(val) => handleSlection(val)} 
                  defaultValue={defaultValue}
                  instanceId={useId()} /> 
              </div>
              <div className="mt-4">
                <button 
                  className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl rounded-lg w-full'
                  type="submit">Post</button>
                </div>
              <div className="mt-4">
                {post.createdBy 
                  ? (<p>Created By: {post.createdBy.name} at {post.createdAt.toDateString()}</p>)
                  : ''}
                {post.updatedBy 
                  ? (<p>Updated By: {post.updatedBy.name} at {post.updatedAt.toDateString()}</p>)
                  : ''}
              </div>
            </div>
          </div>
        </form>
        
      </div>)
    : <p>Cannot find post data</p>}
    </>
  )
}