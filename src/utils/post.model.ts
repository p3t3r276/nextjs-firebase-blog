import { Timestamp } from "firebase-admin/firestore";
import { BlogUser } from "./user.model";

export interface Post {
  id: string,
  title: string,
  content: string,
  createdAt: Date,
  createdBy?: BlogUser,
  updatedAt: Date,
  updatedBy?: BlogUser,
  tags: Tag[]
}

export interface Tag {
  id: string,
  name: string
}

export const EmptyPost = (currentUser: BlogUser, createdAt: Date): Post  => {
  return <Post>{ id: "", title: '', content: '', createdAt: createdAt, updatedAt: createdAt, createdBy: currentUser, updatedBy: currentUser, tags: <Tag[]>[] }
}