"use client";
import { motion } from "motion/react";
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
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user } = useUser();
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<TPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const fetchPosts = () => {
    axios
      .get(`/api/posts/user/${user?.id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPosts((prev) => {
          const newPosts = [...prev, ...res.data];
          const filteredPosts: any[] = Array.from(
            new Map(newPosts.map((p) => [p.id, p]) as any).values()
          );

          return filteredPosts;
        });
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        console.log(err);
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
              <motion.h1
                onClick={() => router.push(`/user/followers/${user.id}`)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                Followers: {user.followers.length}
              </motion.h1>
              <motion.h1
                onClick={() => {
                  router.push(`/user/following/${user.id}`);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
              >
                Following: {user.following.length}
              </motion.h1>
            </div>
          </div>
          <InfiniteScroll
            hasMore={hasMore}
            loader={
              <div className="flex w-full justify-center">
                <Loading className="flex items-center justify-center mt-[20vh] w-fit" />
              </div>
            }
            next={fetchPosts}
            dataLength={posts.length}
            className="flex justify-center flex-col overflow-hidden my-[20vh] py-5 px-10 gap-4"
          >
            {posts.map((post) => (
              <Post key={post.id as string} post={post} setPosts={setPosts} />
            ))}
          </InfiniteScroll>
          {error && <Error className="text-center my-[10vh]">{error}</Error>}
        </>
      )}
    </>
  );
}
