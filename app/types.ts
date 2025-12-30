import { Subject } from "./generated/prisma/enums";

export interface TUser {
  id: String;
  username: String;
  email: String;
  password: String;
  posts: TPost[];
  requests: TRequest[];
  followers: TUser[];
  following: TUser[];
  viewedPosts: TPost[];
  createdAt: Date;
}
export interface TPost {
  id: String;
  title: String;
  content: String;
  subject: Subject;
  createdAt: Date;
  updatedAt: Date;
  likes: Number;
  likedUsers: TUser[];
  author: TUser;
  authorId: String;
  imagesUrl: String[];
}
export interface TRequest {
  id: String;
  title: String;
  content: String;
  author: TUser;
  authorId: String;
  subject: Subject;
  createdAt: Date;
  updatedAt: Date;
}
export interface TJWT {
  id: string;
  username: string;
  email: string;
}
