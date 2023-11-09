import { Timestamp } from "firebase/firestore";
import { User } from '@firebase/auth-types';

export interface Post {
  id: string,
  title: string,
  content: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  createdBy: User,
  updatedBy: User
}