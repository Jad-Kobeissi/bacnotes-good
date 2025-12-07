"use client";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import Loading from "../Loading";
import Nav from "../Nav";
import { TPost } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import Post from "../Post";
import Error from "../Error";

export default function Profile() {
  const { user } = useUser();
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<TPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const fetchPosts = () => {
    axios
      .get(`/api/posts/user/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPosts((prev) => {
          const newPosts = [...prev, ...res.data];
          const filteredPosts = newPosts.filter(
            (post) => post.authorId === user?.id,
          );
          return filteredPosts;
        });
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    if (!user) return;
    fetchPosts();
  }, [user]);
  return (
    <>
      <Nav />
      {!user ? (
        <Loading className="flex items-center justify-center h-screen" />
      ) : (
        <>
          <div className="flex flex-col items-center justify-center pt-[30vh]">
            <h1 className="text-[1.2rem] font-semibold">{user.username}</h1>
            <div className="flex text-gray-600 gap-4 font-medium">
              <h1>Followers: {user.followers.length}</h1>
              <h1>Following: {user.following.length}</h1>
            </div>
          </div>
          <InfiniteScroll
            hasMore={hasMore}
            loader={
              <Loading className="flex items-center justify-center mt-[20vh]" />
            }
            next={fetchPosts}
            dataLength={posts.length}
            className="flex justify-center"
          >
            {posts.map((post) => (
              <Post key={post.id as string} post={post} />
            ))}
          </InfiniteScroll>
          {error && <Error className="text-center mt-[10vh]">{error}</Error>}
        </>
      )}
    </>
  );
}
