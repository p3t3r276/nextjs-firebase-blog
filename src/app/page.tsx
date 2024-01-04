import Link from 'next/link'

import { getCurrentUser } from '@/db/firebaseAdmin';
import { getAllPosts } from '@/utils/postsService-server';
import { Post } from '@/utils/post.model';
import { PostItem } from '@/components/PostItem';

export default async function Home() {
  const currentUser = await getCurrentUser();
  let posts: Post[] = []
  if (currentUser) {
    posts = await getAllPosts()
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full font-mono text-sm">
        <h1 className="text-center text-4xl">Notes</h1>
        <p className="text-center text-2xl">Taking note the new way.</p>
        <div className='mt-4'>
          {currentUser ? (
            <>
              <Link href={'/posts/edit/new'} className='text-white border-2 border-slate-900 bg-slate-950 hover:bg-slate-800 p-3 text-xl rounded-lg' >
                New Post
              </Link>
              <div className='mt-4'></div>
              {posts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
            </>
          )
          : (
            <p>Please login</p>
          ) }
        </div>
      </div>
    </main>
  );
}
