import { Firestore, Query, Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "@/db/firebase";
import { postCollection, tagCollection } from "./constants";
import { Post, Tag } from "./post.model";
import { createTags, getTagsByPostId } from "./tagsService";
import { BlogUser } from "./user.model";

export const createPost = async (post: Post, allTags: Tag[]) => {
  try {
    const { id, tags, ...rest } = post
    const snapShot = await addDoc(collection(db, postCollection), rest)

    /* update tags */
    // add new tags
    let addedTags = post.tags.filter(tag => allTags.some(item => item.id === tag.id))
    // create new tags and add
    let newlyCreatedTags = post.tags.filter(tag => tag.id === tag.name);
  
    if (newlyCreatedTags.length > 0) {
      // create new tags and add to post
      const newTags = await createTags(newlyCreatedTags)
      addedTags.push(...newTags)
    }
    const batch = writeBatch(db);
    const postRef = doc(db, postCollection, snapShot.id)
    const tagSubColRef = collection(postRef, tagCollection)

    addedTags.map(tag => {
      batch.set(doc(tagSubColRef), { name: tag.name })
    })

    await batch.commit();
    return snapShot.id
  } catch(err) {
    console.error(err)
  }
}

export const updatePost = async (post: Post, allTags: Tag[], currentUser: BlogUser) => {
  const postTagsDataFromServer = await getTagsByPostId(post.id);
  
  /* update tags */
  // add new tags
  let addedTags = post.tags.filter(tag => allTags.some(item => tag.id === item.id) && !postTagsDataFromServer.some(item => item.id === tag.id))
  // create new tags and add
  let newlyCreatedTags = post.tags.filter(tag => tag.id === tag.name);
  // delete tags
  let deletedTags = postTagsDataFromServer.filter(tag => !post.tags.some(item => item.id === tag.id))
  
  if (newlyCreatedTags.length > 0) {
    // create new tags and add to post
    const newTags = await createTags(newlyCreatedTags)
    addedTags.push(...newTags)
  }

  await updateDoc(doc(db, postCollection, post.id), {
    title: post.title,
    content: post.content,
    updatedAt: new Date(),
    updatedBy: {
      name: currentUser.name,
      email: currentUser.email,
      photoURL: currentUser?.photoURL
    }
  })

  const updateTagsSubCol = writeBatch(db);
  const postRef = doc(db, postCollection, post.id)
  const tagSubColRef = collection(postRef, tagCollection)

  deletedTags.map(tag => {
    updateTagsSubCol.delete(doc(tagSubColRef, tag.id));
  })

  addedTags.map(tag => {
    updateTagsSubCol.set(doc(tagSubColRef), { name: tag.name })
  })

  await updateTagsSubCol.commit();
  return post.id
}

export const removePostById = async (postId: string) => {
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

async function deleteCollection(
  db: Firestore, 
  collectionPath: string, 
  batchSize: number = 20
) {
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