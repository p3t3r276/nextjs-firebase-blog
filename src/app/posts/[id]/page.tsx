import { FC } from "react";
import { blogPostsData } from '../../../utils/blogPost.data'

interface pageProps {
  params: { id: string }
}

const Post: FC<pageProps> = ({ params }) => {
  const index = blogPostsData.findIndex(post => post.id == params.id)
  const post = blogPostsData[index]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm lg:flex">
        <h2 className="text-4xl text-center mb-4">{post.title}</h2>
        <div>
          {post.content}
        </div>
      </div>
    </main>
  )
}

export default Post;