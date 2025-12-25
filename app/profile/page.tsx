"use client";
import { motion } from "motion/react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
import Loading from "../Loading";
import Nav from "../Nav";
import { TPost } from "../types";
import axios from "axios";
import { deleteCookie, getCookie } from "cookies-next";
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
            <div className="flex gap-2 items-center justify-center">
              <h1 className="text-[1.2rem] font-semibold">{user.username}</h1>
              <button
                className="bg-(--brand) px-4 py-1 rounded-md text-background border
                      border-(--brand) hover:bg-transparent active:bg-transparent
                      hover:text-(--brand) active:text-(--brand) transition-all
                      duration-200"
                onClick={() => {
                  axios
                    .delete(`/api/user/${user.id}`, {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    })
                    .then((res) => {
                      alert("User deleted successfully");
                      deleteCookie("token");
                      sessionStorage.clear();
                      router.push("/");
                    })
                    .catch((err) => {
                      console.log(err);
                      alert("Error deleting user");
                    });
                }}
              >
                Delete
              </button>
            </div>
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
            <button
              className="bg-(--blue) text-background px-3  py-1 rounded-md font-semibold border border-(--blue) hover:bg-transparent hover:text-(--blue) transition-all duration-200 flex gap-2 group"
              onClick={() => {
                router.push(`/profile/edit/${user.id}`);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                fill="currentColor"
                className="w-5 fill-white group-hover:fill-(--blue)"
              >
                <path d="M100.4 417.2C104.5 402.6 112.2 389.3 123 378.5L304.2 197.3L338.1 163.4C354.7 180 389.4 214.7 442.1 267.4L476 301.3L442.1 335.2L260.9 516.4C250.2 527.1 236.8 534.9 222.2 539L94.4 574.6C86.1 576.9 77.1 574.6 71 568.4C64.9 562.2 62.6 553.3 64.9 545L100.4 417.2zM156 413.5C151.6 418.2 148.4 423.9 146.7 430.1L122.6 517L209.5 492.9C215.9 491.1 221.7 487.8 226.5 483.2L155.9 413.5zM510 267.4C493.4 250.8 458.7 216.1 406 163.4L372 129.5C398.5 103 413.4 88.1 416.9 84.6C430.4 71 448.8 63.4 468 63.4C487.2 63.4 505.6 71 519.1 84.6L554.8 120.3C568.4 133.9 576 152.3 576 171.4C576 190.5 568.4 209 554.8 222.5C551.3 226 536.4 240.9 509.9 267.4z" />
              </svg>
              Edit page
            </button>
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
