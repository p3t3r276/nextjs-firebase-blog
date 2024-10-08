import { getPostById } from "@/utils/postsService-server";
import { dateTransform } from "@/utils/dateUtils";
import { Suspense } from 'react';
import Loading from './loading'

interface pageProps {
  params: { id: string }
}

export default async function Page ({ params }: pageProps) {
  const post = await getPostById(params.id)
  if (!post) {
    return <p>Cannot find post</p>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm">
        <Suspense fallback={<Loading />}>
          {post ? (
            <>
              <h2 className="text-4xl text-center mb-8">{post.title}</h2>
              <ul className="flex">
                {post.tags?.map(tag => 
                  <li key={tag.id} className="rounded-lg bg-slate-900 px-4 py-2 text-white m-1">{tag.name}</li>)
                }
              </ul>
              <div dangerouslySetInnerHTML={{ __html: post.content }}>
              </div>
              <div className="mt-4">
                Created By: {post.createdBy?.name} at {dateTransform(post.createdAt, 'DD/MM/yyyy HH:mm')} <br /> 
                Updated By: {post.updatedBy?.name} at {dateTransform(post.updatedAt, 'DD/MM/yyyy HH:mm')}
              </div>
            </>
          ) : ''}
        </Suspense>
      </div>
    </main>
  )
}
