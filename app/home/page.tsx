"use client";

import { algoliasearch } from "algoliasearch";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

import { useEffect, useRef, useState } from "react";
import { TPost } from "../types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Cap from "../icons/graduation-cap";
import Link from "next/link";
import Nav from "../Nav";
import Error from "../Error";
import Post from "../Post";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";

export default function Home() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const files = useRef<HTMLInputElement>(null);
  const textarearef = useRef<HTMLTextAreaElement>(null);
  const title = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const fetchPosts = () => {
    axios
      .get("/api/posts", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts((prev) => {
          const newPosts = [...prev, ...res.data];
          sessionStorage.setItem("posts", JSON.stringify(newPosts));

          const filteredPosts: any[] = Array.from(
            new Map<string, TPost>(
              newPosts.map((p) => [p.id, p]) as any
            ).values()
          );
          return filteredPosts;
        });
      })
      .catch((err) => {
        setHasMore(false);
        setError(err.response.data);
      });
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    const postsStorage = JSON.parse(sessionStorage.getItem("posts") as string);
    if (!postsStorage) return;
    setTimeout(() => {
      setPosts((prev) => {
        const newPosts = [...prev, ...postsStorage];

        const filteredPosts = Array.from(
          new Map<string, TPost>(newPosts.map((p) => [p.id, p]) as any).values()
        );

        return filteredPosts as any;
      });
    }, 0);
  }, []);
  const handleInput = () => {
    const el = textarearef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  };
  return (
    <>
      <Nav />
      <div className="pt-[10vh]">
        <div className="w-3/4 min-[600px]:mx-8 flex flex-col gap-4 max-[600px]:w-screen">
          <form
            className="border border-gray-300 rounded-lg w-full py-4 px-4 flex justify-between items-center"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData();
              formData.append("title", title.current?.value as string);
              formData.append("content", textarearef.current?.value as string);
              Array.from(files.current?.files || []).map((file) => {
                formData.append("files", file);
              });
              axios
                .post(`/api/posts`, formData, {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                })
                .then((res) => {
                  alert("Post created successfully!");
                  if (title.current) title.current.value = "";
                  if (textarearef.current) textarearef.current.value = "";
                  if (files.current) files.current.value = "";
                });
            }}
          >
            <div className="w-full">
              <input
                type="text"
                placeholder="Title"
                ref={title}
                className="placeholder:font-semibold font-semibold w-full"
              />
              <textarea
                ref={textarearef}
                onInput={handleInput}
                placeholder="Whats on your mind?"
                className="flex items-center placeholder:items-center h-auto w-full"
                rows={2}
              />
              <label htmlFor="file">
                <img src="/customSvgs/image.svg" className="w-[1.6rem]" />
              </label>
              <input
                multiple
                id="file"
                ref={files}
                type="file"
                className="hidden"
              />
            </div>
            <button className="bg-(--brand) text-background px-4 py-1 rounded-md border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200 ">
              Post
            </button>
          </form>
          <button
            onClick={() => router.push("/search")}
            className="bg-(--brand) text-background rounded-md mx-4 w-fit px-4 py-1 border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200 "
          >
            Go To Search
          </button>
          <InfiniteScroll
            dataLength={posts.length}
            next={() => {
              fetchPosts();
            }}
            hasMore={hasMore}
            loader={
              <Loading className="flex items-center justify-center mt-[10vh]" />
            }
            className="flex justify-center flex-col min-[600px]:w-3/4 overflow-hidden my-[20vh] py-5 px-10 gap-4 "
          >
            {posts.map((post) => (
              <Post key={post.id as string} post={post} />
            ))}
          </InfiniteScroll>
        </div>
      </div>

      {error && <Error className="text-[1.5rem] text-center">{error}</Error>}
    </>
  );
}
