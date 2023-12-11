'use client'
import { FC, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Timestamp, addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, writeBatch } from "firebase/firestore";

import { db } from "@/db/firebase";
import { postCollection, tagCollection } from "@/utils/constants";
import { UserAuth } from "@/context/AuthContext";
import { Post, Tag } from "@/utils/post.model";
import { BlogUser } from "@/utils/user.model";
import { Form } from "@/components/postForm";

interface pageProps {
  params: { id: string }
}

const EditPost: FC<pageProps> = ({ params }) => {
  const { user } = UserAuth()
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post>();
  const [mode, setMode] = useState('new')
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    async function getPostById(id: string) {
      const snapshot = await getDoc(doc(db, postCollection, params.id))
      if (snapshot.exists()) {
        const postData: Post = snapshot.data() as any;
        postData.id = snapshot.id
        
        // get tags data
        // Query the tags subcollection
        const tagsQuerySnapshot = query(collection(db, `${postCollection}/${snapshot.id}/${tagCollection}`))
        
        const unsubscribe = onSnapshot(tagsQuerySnapshot, (querySnapshot) => {
          let tags: Tag[] = [];
          querySnapshot.forEach(doc => {
            tags.push({ ...doc.data() as any, id: doc.id})
          })
          setPost({ ...snapshot.data() as any, id: snapshot.id, tags  })
          return () => unsubscribe()
        })
      }
    }
    
    if (params.id === 'new') {  
      setMode('new')
      const newDate  = Timestamp.fromDate(new Date())
      const currentBlogUser: BlogUser = {
        id: user?.id,
        name: user?.name,
        email: user?.email
      }
      setPost({ id: "", title: '', content: '', createdAt: newDate, updatedAt: newDate, createdBy: currentBlogUser, updatedBy: currentBlogUser, tags: [] })
    } else {
      setMode('edit');
      try {
        setLoading(true)
        getPostById(params.id)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false);
      }
    }
  }, [])

  useEffect(() => {
    const q = query(collection(db, tagCollection))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let tagArr: Tag[] = [];

      querySnapshot.forEach((doc) => {
        tagArr.push({ ...doc.data() as any, id: doc.id})
      })
      setTags(tagArr)
      return () => unsubscribe();
    })
  }, [])
  
  function handleChange(name: string, value: any) {
    setPost({ ...post, [name]: value } as any);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (post) {
        if (mode == 'new') {
          const { id, tags, ...rest } = post
          const snapShot = await addDoc(collection(db, postCollection), rest)
          console.log(tags)
          const batch = writeBatch(db);
          const postRef = doc(db, postCollection, snapShot.id)

          tags.map(tag => {
            let tagRef = doc(collection(postRef, tagCollection))
            batch.set(tagRef, tag)
          })
          await batch.commit();
          router.push('/')
        } else {
          const getTagsByPostId = async (id: string) => {
            let result: Tag[] = [];
            
            const tagsSubColRef = collection(db, `${postCollection}/${id}/${tagCollection}`)
            
            const snapShot= await getDocs(tagsSubColRef)
            snapShot.docs.forEach(doc => {
              result.push({ ...doc.data() as any, id: doc.id})
            })

            return result;
          }

          const updatePost = async (post: Post) => {
            const postTagsDataFromServer = await getTagsByPostId(post.id);
            
            /* update tags */
            // add new tags
            let addedTags = post.tags.filter(tag => tags.includes(tag) && !postTagsDataFromServer.includes(tag))
            // create new tags and add
            let newlyCreatedTags = post.tags.filter(tag => tag.id === tag.name);
            // delete tags
            let deletedTags = postTagsDataFromServer.filter(tag => !post.tags.includes(tag))
            
            if (newlyCreatedTags.length > 0) {
              // create new tags
              const newTagsWriteBatch = writeBatch(db);

              newlyCreatedTags = newlyCreatedTags.map(tag => {
                const tagRef = doc(collection(db, tagCollection));
                newTagsWriteBatch.set(tagRef, { name: tag.name })
                return Object.assign({}, tag, { id : tagRef.id })
              })
              await newTagsWriteBatch.commit();

              addedTags.push(...newlyCreatedTags)
            }

            await updateDoc(doc(db, postCollection, post.id), {
              title: post.title,
              content: post.content,
              updatedAt: Timestamp.fromDate(new Date()),
              updatedBy: {
                id: user?.id,
                name: user?.name,
                email: user?.email
              }
            })

            const updateTagsSubCol = writeBatch(db);
            const postRef = doc(db, postCollection, post.id)
            const tagSubColRef = collection(postRef, tagCollection)

            deletedTags.map(tag => {
              updateTagsSubCol.delete(doc(tagSubColRef, tag.id));
            })

            console.log(addedTags)
            addedTags.map(tag => {
              updateTagsSubCol.set(doc(tagSubColRef), { name: tag.name })
            })

            await updateTagsSubCol.commit();
          }

          await updatePost(post)
          router.push('/')      
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-8xl w-full font-mono text-sm">
        <h2 className='text-center text-4xl'>{mode === 'new' ? 'New Post' : 'Edit Post'}</h2>
        <Form post={post} handleChange={handleChange} handleSubmit={handleSubmit} tags={tags} />
      </div>
    </main>
  )
}

export default EditPost;