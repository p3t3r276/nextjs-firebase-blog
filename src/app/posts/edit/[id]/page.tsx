import { FC, Suspense } from "react";

import { Form } from "@/components/postForm";
import { getPostById } from "@/utils/postsService-server";
import { getAllTags } from "@/utils/tagsService-server";
import { getCurrentUser } from "@/db/firebaseAdmin";
import { redirect } from "next/navigation";
import Loading from "./loading";
import { EmptyPost } from "@/utils/post.model";

interface pageProps {
  params: { id: string }
}

const EditPost: FC<pageProps> = async ({ params }) => {
  const currentUser = await getCurrentUser();
  if (!currentUser)
    redirect('/')

  let post;
  if (params.id === 'new') {
    post = EmptyPost(currentUser, new Date())
  } else {
    post = await getPostById(params.id);
  }
   
  if (!post) 
    return (<p>No Post... Please go back</p>)
  
  const tags = await getAllTags()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-8xl w-full font-mono text-sm">
        <h2 className='text-center text-4xl'>{params.id === 'new' ? 'New Post' : 'Edit Post'}</h2>
        <Suspense fallback={<Loading />}>
          <Form postProp={post} tags={tags} />
        </Suspense>
      </div>
    </main>
  )
}

export default EditPost;