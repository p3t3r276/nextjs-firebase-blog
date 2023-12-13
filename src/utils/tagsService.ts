import { collection, doc, getDocs, onSnapshot, query, writeBatch } from "firebase/firestore";
import { Tag } from "./post.model";
import { db } from "@/db/firebase";
import { postCollection, tagCollection } from "./constants";

export const getAllTags = async () => {
    let tagArr: Tag[] = [];
    const q = query(collection(db, tagCollection))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
        tagArr.push({ ...doc.data() as any, id: doc.id})
    })
    return tagArr;
}

export const getTagsByPostId = async (id: string) => {
    let result: Tag[] = [];

    const tagsSubColRef = collection(db, `${postCollection}/${id}/${tagCollection}`)

    const snapShot= await getDocs(tagsSubColRef)
    snapShot.docs.forEach(doc => {
        result.push({ ...doc.data() as any, id: doc.id})
    })

    return result;
}

export const createTags = async (tags: Tag[]) => {
    const newTagsWriteBatch = writeBatch(db);

    tags = tags.map(tag => {
        const tagRef = doc(collection(db, tagCollection));
        newTagsWriteBatch.set(tagRef, { name: tag.name })
        return Object.assign({}, tag, { id : tagRef.id })
    })
    await newTagsWriteBatch.commit();
    return tags
}