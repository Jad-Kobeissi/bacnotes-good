"use client";
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

export default function Home() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const textarearef = useRef<HTMLTextAreaElement>(null);
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

          return newPosts;
        });
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  useEffect(() => {
    const postsStorage = JSON.parse(sessionStorage.getItem("posts") as string);
    if (!postsStorage) return;
    setPosts((prev) => [...postsStorage, ...prev]);
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
          <div className="border border-gray-300 rounded-lg w-full py-4 px-4 flex justify-between items-center">
            <textarea
              ref={textarearef}
              onInput={handleInput}
              placeholder="Whats on your mind?"
              className="flex items-center placeholder:items-center h-auto w-full"
              rows={2}
            />
            <button className="bg-(--brand) text-background px-4 py-1 rounded-md border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200 ">
              Post
            </button>
          </div>
          <div>
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
      {error && (
        <Error className="text-[1.5rem] text-center my-[20vh]">{error}</Error>
      )}
    </>
  );
}
