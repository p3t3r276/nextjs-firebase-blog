import Link from 'next/link'
import { PostList } from "./components/PostList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full font-mono text-sm lg:flex">
        <h1 className="text-center text-4xl">Notes</h1>
        <p className="text-center text-xl">Taking note the new way.</p>
        <Link href={'/posts/new'} className='text-white border-2 border-slate-900 bg-slate-950 hover:bg-slate-900 p-3 text-xl' >
          New Post
        </Link>
        <PostList />
      </div>
    </main>
  );
}
