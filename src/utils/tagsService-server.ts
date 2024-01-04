import { dbAdmin } from "@/db/firebaseAdmin";
import { Tag } from "./post.model";
import { postCollection, tagCollection } from "./constants";

export const getAllTags = async () => {
    let tagArr: Tag[] = [];
    const docs = await dbAdmin.collection(tagCollection).get()
    docs.forEach((doc) => {
        tagArr.push({ ...doc.data() as any, id: doc.id})
    })
    return tagArr;
}

export const getTagsByPostId = async (id: string) => {
    let result: Tag[] = [];

    const tagSubDocs = await dbAdmin.collection(`${postCollection}/${id}/${tagCollection}`).get()

    tagSubDocs.docs.forEach(doc => {
        result.push({ ...doc.data() as any, id: doc.id})
    })

    return result;
}