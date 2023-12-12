import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { Tag } from "./post.model";
import { db } from "@/db/firebase";
import { postCollection, tagCollection } from "./constants";

export const getAllTags = () => {
    let tagArr: Tag[] = [];
    const q = query(collection(db, tagCollection))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
        tagArr.push({ ...doc.data() as any, id: doc.id})
        })
        return () => unsubscribe();
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