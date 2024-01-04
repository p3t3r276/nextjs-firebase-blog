import { FC, useCallback, useEffect, useState } from "react";

import { Post } from '../../../utils/post.model'
import { getPostById } from "@/utils/postsService-server";

interface pageProps {
  params: { id: string }
}

export default async function Post ({ params }: pageProps) {
  const post = await getPostById(params.id)
  if (!post) {
    return <p>Cannot find post</p>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        {post ? (
          <>
            <h2 className="text-4xl text-center mb-8">{post.title}</h2>
            <ul className="flex">
              {post.tags.map(tag => 
                <li key={tag.id} className="rounded-lg bg-slate-900 px-4 py-2 text-white m-1">{tag.name}</li>)
              }
            </ul>
            <div dangerouslySetInnerHTML={{ __html: post.content }}>
            </div>
            <div className="mt-4">
              Created By: {post.createdBy?.name} at {post.createdAt.toDateString()} <br /> 
              Updated By: {post.updatedBy?.name} at {post.updatedAt.toDateString()}
            </div>
          </>
        ) : ''}
      </div>
    </main>
  )
}
