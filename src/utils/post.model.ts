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
  tag: Tag[]
}

export interface Tag {
  id?: string,
  name: string
}