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
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";

export default function Home() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [files, setFiles] = useState<File[]>([]);
  const textarearef = useRef<HTMLTextAreaElement>(null);
  const title = useRef<HTMLInputElement>(null);
  const [subject, setSubject] = useState("");
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
      {loading ? (
        <Loading className="flex items-center justify-center pt-[30vh]" />
      ) : (
        <>
          <div className="pt-[10vh]">
            <div className="flex gap-8 justify-center mb-10">
              <button
                className=""
                onClick={() => {
                  router.push("/home");
                }}
              >
                Posts
              </button>
              <button
                className="text-(--secondary-text)"
                onClick={() => {
                  router.push("/requests");
                }}
              >
                Requests
              </button>
            </div>
            <div className="w-3/4 min-[600px]:mx-8 flex flex-col gap-4 max-[600px]:w-screen">
              <form
                className="border border-gray-300 rounded-lg w-full py-4 px-4 flex justify-between items-center flex-col gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  const formData = new FormData();
                  formData.append("title", title.current?.value as string);
                  formData.append(
                    "content",
                    textarearef.current?.value as string
                  );
                  formData.append("subject", subject);
                  Array.from(files || []).map((file) => {
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
                      if (files) setFiles([]);
                      setSubject("");
                    })
                    .catch((err) => alert("Error Posting"))
                    .finally(() => setLoading(false));
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
                  <select
                    name="subject"
                    id="subject"
                    className="flex items-center placeholder:items-center h-auto w-full"
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                    }}
                  >
                    <option value="">Select a Subject</option>
                    <option value="ENGLISH">English</option>
                    <option value="ARABIC">Arabic</option>
                    <option value="MATH">Math</option>
                    <option value="FRENCH">French</option>
                    <option value="PHYSICS">Physics</option>
                    <option value="CHEMISTRY">Chemistry</option>
                    <option value="BIOLOGY">Biology</option>
                    <option value="GEOGRAPHY">Geography</option>
                    <option value="CIVICS">Civics</option>
                    <option value="HISOTRY">History</option>
                  </select>
                </div>
                <div className="flex gap-2 w-full">
                  {files?.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="border border-gray-300 px-4 text-gray-700 rounded-md py-1 flex flex-row-reverse gap-1"
                    >
                      <h1>{file.name}</h1>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 640 640"
                        fill="currentColor"
                        className="w-5 text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFiles((prev) =>
                            prev.filter(
                              (f, i) =>
                                `${f.name}-${i}` !== `${file.name}-${index}`
                            )
                          );
                        }}
                      >
                        <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between w-full">
                  <div className="text-(--brand)">
                    <label htmlFor="file" className="flex gap-2 p-1 rounded-md">
                      <img src="/customSvgs/image.svg" className="w-[1.6rem]" />
                      <h1>Photo</h1>
                    </label>
                    <input
                      multiple
                      id="file"
                      type="file"
                      onChange={(e) =>
                        setFiles(Array.from(e.target.files ?? []))
                      }
                      className="hidden"
                    />
                  </div>
                  <button className="bg-(--brand) text-background px-4 py-1 rounded-md border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200 ">
                    Post
                  </button>
                </div>
              </form>
              <button
                onClick={() => router.push("/search")}
                className="bg-(--brand) text-background rounded-md mx-4 px-4 py-1 border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200 flex items-center justify-center font-semibold gap-2 group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  fill="currentColor"
                  className="w-5 fill-white group-hover:fill-(--brand)"
                >
                  <path d="M480 272C480 317.9 465.1 360.3 440 394.7L566.6 521.4C579.1 533.9 579.1 554.2 566.6 566.7C554.1 579.2 533.8 579.2 521.3 566.7L394.7 440C360.3 465.1 317.9 480 272 480C157.1 480 64 386.9 64 272C64 157.1 157.1 64 272 64C386.9 64 480 157.1 480 272zM272 416C351.5 416 416 351.5 416 272C416 192.5 351.5 128 272 128C192.5 128 128 192.5 128 272C128 351.5 192.5 416 272 416z" />
                </svg>
                Go To Search
              </button>
              <div className="flex w-full items-center justify-center ">
                <select
                  name="subject"
                  id="subject"
                  className="border border-(--brand) px-4 py-1 rounded-md text-(--brand)"
                  onChange={(e) => {
                    router.push(`/home/subject/${e.target.value}`);
                  }}
                >
                  <option value="">Filter by Subject</option>
                  <option value="ENGLISH">English</option>
                  <option value="ARABIC">Arabic</option>
                  <option value="MATH">Math</option>
                  <option value="FRENCH">French</option>
                  <option value="PHYSICS">Physics</option>
                  <option value="CHEMISTRY">Chemistry</option>
                  <option value="BIOLOGY">Biology</option>
                  <option value="GEOGRAPHY">Geography</option>
                  <option value="CIVICS">Civics</option>
                  <option value="HISOTRY">History</option>
                </select>
              </div>
              <InfiniteScroll
                dataLength={posts.length}
                next={() => {
                  fetchPosts();
                }}
                hasMore={hasMore}
                loader={
                  <Loading className="flex items-center justify-center mt-[10vh]" />
                }
                className="flex justify-center flex-col overflow-hidden my-[20vh] py-5 min-[422px]:px-10 gap-4 "
              >
                {posts.map((post) => (
                  <Post
                    key={post.id as string}
                    post={post}
                    setPosts={setPosts}
                  />
                ))}
              </InfiniteScroll>
            </div>
          </div>
          {error && (
            <Error className="text-[1.5rem] text-center">{error}</Error>
          )}
        </>
      )}
    </>
  );
}
