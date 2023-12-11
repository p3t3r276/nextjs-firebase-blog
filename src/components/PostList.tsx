'use client'
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import { Firestore, Query, collection, deleteDoc, doc, getDocs, limit, onSnapshot, orderBy, query, writeBatch } from 'firebase/firestore';
import { AiTwotoneEdit } from 'react-icons/ai'
import { FaTrashAlt } from 'react-icons/fa'

import { Post } from '@/utils/post.model';
import { db } from '@/db/firebase';
import { postCollection, tagCollection } from '@/utils/constants';
import { durationFromNow } from '@/utils/dateTransform';

export const PostList = () => {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const q = query(collection(db, postCollection), orderBy('updatedAt', 'desc'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let postArr: Post[] = [];

      querySnapshot.forEach((doc) => {
        postArr.push({ ...doc.data() as any, id: doc.id})
      })
      setPosts(postArr)
      return () => unsubscribe();
    })
  }, [])

  const removePost = async (postId: string) => {
    // delete subcollection from web client is not recommended
    // setup API endpoint
    // await fetch('/api/posts', {
    //   method: 'DELETE',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ postId }),
    // })
    // .then(response => {
    //   console.log(response)
    // })
    // .catch(error => {
    //   console.log(error)
    // });
    const postDocRef = doc(db, postCollection, postId)
    const tagSubColPath: string = `${postCollection}/${postId}/${tagCollection}`;

    // delete all tags first
    await deleteCollection(db, tagSubColPath)
    await deleteDoc(postDocRef)
  }

  return (
    <div className='group flex flex-col gap-2 mt-4'>
      {posts.map((post, id) => (
        <div key={id} className='grid grid-cols-6 items-center'>
          <Link href={`/posts/${post.id}`} className='col-span-4 rounded-l-lg bg-slate-400 p-5 text-white my-2'>
            <h2>{post.title}</h2>
            <div>Author: {post.createdBy?.name}</div>
            <div>Edited by: {post.updatedBy?.name} {durationFromNow(post.updatedAt)}</div>
          </Link>
          <button
            className='flex items-center justify-center bg-blue-500 hover:bg-blue-400 text-white text-xl p-10'
            onClick={() => router.push(`/posts/edit/${post.id}`)}>
              <AiTwotoneEdit />
              <span className='sr-only'>Edit</span> 
            </button>
          <button
            className='flex items-center justify-center rounded-r-lg bg-red-500 hover:bg-red-400 text-white text-xl p-10'
            onClick={() => removePost(post.id)}>
              
              <FaTrashAlt />
              <span className='sr-only'>Delete</span>
          </button>
        </div>
      ))}
    </div>
  )
}

async function deleteCollection(db: Firestore, collectionPath: string, batchSize: number = 20) {
  const collectionRef = collection(db, collectionPath);
  const collectionQuery = query(collectionRef, limit(batchSize));

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, collectionQuery, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db: Firestore, query: Query, resolve: (value: unknown) => void) {
  const snapshot = await getDocs(query);

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    // When there are no documents left, we are done
    resolve(true);
    return;
  }

  // Delete documents in a batch
  const batch = writeBatch(db);
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  // Recurse on the next process tick, to avoid
  // exploding the stack.
  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}