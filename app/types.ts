export interface TUser {
  id: String;
  username: String;
  email: String;
  password: String;
  posts: TPost[];
  viewedPosts: TPost[];
  createdAt: Date;
}
export interface TPost {
  id: String;
  title: String;
  content: String;
  createdAt: Date;
  updatedAt: Date;
  author: TUser;
  authorId: String;
  imagesUrl: String[];
}
export interface TJWT {
  id: string;
  username: string;
  email: string;
}
