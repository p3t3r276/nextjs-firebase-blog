'use client'
import { ChangeEvent, FC, FormEvent, useState } from "react";
import { blogPostsData } from '../../../../utils/blogPost.data'
import { Form } from "@/components/postForm";
import { useRouter } from "next/navigation";
import { Post } from "@/utils/post.model";

interface pageProps {
  params: { id: string }
}

const EditPost: FC<pageProps> = ({ params }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post>({
    id: "",
    title: "",
    content: "",
  });
  const index = blogPostsData.findIndex(post => post.id == params.id)
  setPost(blogPostsData[index])

  function handleChange(e: ChangeEvent<HTMLInputElement> | 
    ChangeEvent<HTMLTextAreaElement>) {
      setPost({ ...post, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const post = blogPostsData.filter(post => post.id != params.id)
    // blogPostsData.push({ ...post as any, id: lastPost.id + 1});
    router.push('/')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm lg:flex">
        <Form post={post} handleChange={handleChange} handleSubmit={handleSubmit} />
      </div>
    </main>
  )
}

export default EditPost;