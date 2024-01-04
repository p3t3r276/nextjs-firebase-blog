import 'server-only'
import { postCollection, tagCollection } from "./constants";
import { Post, Tag } from "./post.model";
import { dbAdmin } from '@/db/firebaseAdmin';

export const getAllPosts = async () => {
  let postArr: Post[] = [];
  const docs = await dbAdmin.collection(postCollection).orderBy('updatedAt', 'desc').get()
  
  docs.forEach((doc) => {
    let post: Post = Object.assign(<Post>{ id: doc.id }, doc.data())
    post.updatedAt = doc.data().updatedAt.toDate()
    post.createdAt = doc.data().updatedAt.toDate()
    postArr.push(post)
  })
  return postArr
}

export const getPostById = async (id: string) => {
  try {
    let post: Post | null = null
    const postDoc = await dbAdmin.collection(postCollection).doc(id).get()
    if (postDoc) {
      post = Object.assign(<Post>{ id: postDoc.id }, postDoc.data())
      post.updatedAt = postDoc.data()?.updatedAt.toDate()
      post.createdAt = postDoc.data()?.updatedAt.toDate()
      if (post.id) {
        // get tags data
        // Query the tags subcollection
        const allTags = await dbAdmin.collection(`${postCollection}/${post.id}/${tagCollection}`).get()
        let tags: Tag[] = [];
        allTags.forEach(doc => {
          tags.push({ ...doc.data() as any, id: doc.id})
        })
        post.tags = tags
      }
    }
    return post
  } catch(err) {
    console.error(err)
  }
}
