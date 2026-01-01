"use client";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import Post from "@/app/Post";
import { TPost } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = React.use(params);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const fetchPosts = () => {
    axios
      .get(`/api/posts/subject/${subject}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts((prev) => {
          const unfiltered = [...prev, ...res.data];
          const filteredPosts = Array.from(
            new Map<string, TPost>(
              unfiltered.map((p) => [p.id, p]) as any
            ).values()
          );
          return filteredPosts;
        });
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Nav />
      <div className="pt-[30vh]">
        <h1 className="text-[1.5rem] my-15 text-center">
          Viewing {subject.toLowerCase()} posts
        </h1>
        <InfiniteScroll
          dataLength={posts.length}
          hasMore={hasMore}
          next={fetchPosts}
          loader={
            <Loading className="flex items-center justify-center pt-20" />
          }
          className="w-3/4 flex items-center justify-center flex-col gap-2 mx-4"
        >
          {posts.map((post) => (
            <Post key={post.id as string} post={post} />
          ))}
        </InfiniteScroll>
        {error && (
          <Error className="text-[1.4rem] my-10 text-center">{error}</Error>
        )}
      </div>
    </>
  );
}
