export interface TUser {
  id: String;
  username: String;
  email: String;
  password: String;
  posts: TPost[];
  followers: TUser[];
  following: TUser[];
  viewedPosts: TPost[];

  createdAt: Date;
}
export interface TPost {
  id: String;
  title: String;
  content: String;
  subject: String
  createdAt: Date;
  updatedAt: Date;
  likes: Number;
  likedUsers: TUser[];
  author: TUser;
  authorId: String;
  imagesUrl: String[];
}
export interface TJWT {
  id: string;
  username: string;
  email: string;
}
