import { Subject } from "./generated/prisma/enums";

export interface TUser {
  id: String;
  username: String;
  email: String;
  password: String;
  grade: Number;
  admin: Boolean;
  posts: TPost[];
  requests: TRequest[];
  replies: TReply[];
  followers: TUser[];
  following: TUser[];
  viewedPosts: TPost[];
  likedPosts: TPost[];
  likedReplies: TReply[];
  PostReports: TPostReport[];
  RequestReports: TRequestReport[];
  ReplyReports: TReplyReport[];
  createdAt: Date;
  updatedAt: Date;
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
  reports: TPostReport[];
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
  admin: Boolean;
  grade: Number
}

export interface TPostReport {
  id: String;
  post: TPost;
  postId: String;
  reporter: TUser;
  reporterId: String;
  createdAt: Date;
}
export interface TRequestReport {
  id: String;
  request: TRequest;
  requestId: String;
  reporter: TUser;
  reporterId: String;
  createdAt: Date;
}
export interface TReplyReport {
  id: String;
  reply: TReply;
  replyId: String;
  reporter: TUser;
  reporterId: String;
  createdAt: Date;
}
