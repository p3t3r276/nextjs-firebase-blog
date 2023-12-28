'use client'
import { ChangeEvent, FC, FormEvent, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
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
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [progresspercent, setProgresspercent] = useState(0);

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e.target.name, e.target.value)
  }

  const handleEditor = (value: any) => handleChange('content', value)
  const handleSlection = (value: any) => {
    let valueToSubmit: Tag[] = (value as Item[]).map(item => Object.assign({ id: item.value, name: item.label }, {}))
    handleChange('tags', valueToSubmit)
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleChange('imageUrl', e.target.files[0])
      setImgUrl(URL.createObjectURL(e.target.files[0]))
    } else {
      handleChange('imageUrl', null)
      setImgUrl(null)
    }
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
              <div>
                <CreatableSelect 
                  options={selectItems} 
                  isMulti={true}
                  name="tags"
                  onChange={(val) => handleSlection(val)} 
                  defaultValue={defaultValue} /> 
              </div>
              <div className="mt-4">
                <input 
                  className='text-white
                  file:mr-5 file:py-2 file:px-6
                  file:rounded-full file:border-0
                  file:bg-blue-50 file:text-blue-700
                  hover:file:cursor-pointer hover:file:bg-amber-50
                  hover:file:text-amber-700
                  p-3 text-xl w-full'
                  type="file"
                  name='imageUrl' 
                  onChange={handleImageUpload} />
                {
                  !imgUrl &&
                  <div className='outerbar'>
                    <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                  </div>
                }
                {
                  imgUrl &&
                  <img src={imgUrl} alt='uploaded file' height={200} />
                }
              </div>
              <div className="mt-4">
                <button 
                  className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl rounded-lg w-full'
                  type="submit">Post</button>
              </div>
              <div className="mt-4">
                <Link href={'/'}
                className="block text-center p-3 text-xl rounded-lg w-full">Back</Link>
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