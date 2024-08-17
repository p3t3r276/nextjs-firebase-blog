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

export const EmptyPost = (currentUser: BlogUser): Post  => {
  return <Post>{ id: "", title: '', content: '', createdBy: currentUser, updatedBy: currentUser, tags: <Tag[]>[] }
}