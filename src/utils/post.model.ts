import { Timestamp } from "firebase/firestore";
import { BlogUser } from "./user.model";

export interface Post {
  id: string,
  title: string,
  content: string,
  createdAt: Timestamp,
  createdBy?: BlogUser,
  updatedAt: Timestamp,
  updatedBy?: BlogUser,
  tags: Tag[]
}

export interface Tag {
  id: string,
  name: string
}

export const EmptyPost = (currentUser: BlogUser, createdAt: Timestamp): Post  => {
  return <Post>{ id: "", title: '', content: '', createdAt: createdAt, updatedAt: createdAt, createdBy: currentUser, updatedBy: currentUser, tags: <Tag[]>[] }
}