'use client'
import { ChangeEvent, FC, FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import CreatableSelect from 'react-select/creatable';

import { dateTransform } from "@/utils/dateTransform";
import { Post, Tag } from "@/utils/post.model";
import { Item } from "@/utils/item.model";

interface pageProps {
  post?: Post,
  tags: Tag[],
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void,
  handleChange: (name: string, value: any) => void
}

const Editor = dynamic(() => import("../components/Editor"), { ssr: false });

export const Form: FC<pageProps> = ({ 
  post, 
  handleChange, 
  handleSubmit,
  tags }) => {

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value)
  }

  const handleEditor = (value: any) => handleChange('content', value)
  const handleSlection = (value: any) => {
    let valueToSubmit: Tag[] = (value as Item[]).map(item => Object.assign({ id: item.value, name: item.label }, {}))
    handleChange('tags', valueToSubmit)
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
                  defaultValue={defaultValue} /> 
              </div>
              <div className="mt-4">
                <button 
                  className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl rounded-lg w-full'
                  type="submit">Post</button>
                </div>
              <div className="mt-4">
                <p>Created By: {post.createdBy?.name} at {dateTransform(post.createdAt)}</p>
                <p>Updated By: {post.updatedBy?.name} at {dateTransform(post.updatedAt)}</p>
              </div>
            </div>
          </div>
        </form>
        
      </div>)
    : <p>Cannot find post data</p>}
    </>
  )
}