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
  replies: TReply[];
  createdAt: Date;
  updatedAt: Date;
}
export interface TReply {
  id: String;
  request: Request;
  requestId: String;
  content: String;
  likes: Number;
  likedUsers: TUser[];
  authorId: String;
  author: TUser;
  imageUrls: String[];
  createdAt: Date;
  updatedAt: Date;
}
export interface TJWT {
  id: string;
  username: string;
  email: string;
}
