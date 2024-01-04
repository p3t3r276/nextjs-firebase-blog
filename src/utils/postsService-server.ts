import 'server-only'
import { postCollection } from "./constants";
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
    let postData: Post | null = null
    const snapshot = await dbAdmin.collection(postCollection).doc(id).get()
    if (snapshot) {
      postData = snapshot.data() as any;
      if (postData) {
        postData.id = snapshot.id
      
        // get tags data
        // Query the tags subcollection
        const allTags = await dbAdmin.collection(`${postCollection}/${snapshot.id}`).get()
        
        let tags: Tag[] = [];
        allTags.forEach(doc => {
          tags.push({ ...doc.data() as any, id: doc.id})
        })
        postData.tags = tags
      }
    }
    return postData
  } catch(err) {
    console.error(err)
  }
}
