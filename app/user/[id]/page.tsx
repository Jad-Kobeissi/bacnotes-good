"use client";
import { useUser } from "@/app/contexts/UserContext";
import { motion } from "motion/react";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import Post from "@/app/Post";
import { TPost, TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { RefObject, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BlockDialog from "@/app/dialogs/blockDialog";
import UnblockDialog from "@/app/dialogs/unblockDialog";

export default function User({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fUser, setFUser] = useState<TUser | null>(null);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [errorP, setErrorP] = useState<string | null>(null);
  const blockedDialogRef = useRef<HTMLDialogElement>(null);
  const unblockedDialogRef = useRef<HTMLDialogElement>(null);
  const fetchUser = () => {
    axios
      .get(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setFUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError(() => {
          console.log(err.response.data);

          return err.response.data;
        });
      });
  };
  const fetchPost = () => {
    axios
      .get(`/api/posts/user/${id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
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
        setErrorP(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    if (!fUser) return;
    fetchPost();
  }, [fUser]);
  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="h-screen flex items-center justify-center" />
      ) : (
        <div className="pt-25">
          {!error ? (
            <>
              <div className="pt-25 flex flex-col items-center justify-center gap-2">
                <div className="flex gap-2 items-center">
                  <div className="flex items-center gap-2">
                    <h1 className="text-[1.5rem] font-semibold">
                      {fUser?.username}
                    </h1>
                    {fUser?.admin && (
                      <h1 className="text-(--secondary-text)">admin</h1>
                    )}
                  </div>
                  {fUser?.id !== user?.id && (
                    <>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setLoading(true);
                          axios
                            .post(
                              `/api/user/report/${fUser?.id}`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${getCookie("token")}`,
                                },
                              }
                            )
                            .then((res) => {
                              alert("User reported successfully");
                            })
                            .catch((err) => {
                              alert(
                                "Error reporting user: " + err.response.data
                              );
                            })
                            .finally(() => setLoading(false));
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 640 640"
                          fill="#eb4034"
                          className="w-10"
                        >
                          <path d="M144 88C144 74.7 133.3 64 120 64C106.7 64 96 74.7 96 88L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 452L224.3 431.9C265.4 421.6 308.9 426.4 346.8 445.3C391 467.4 442.3 470.1 488.5 452.7L523.2 439.7C535.7 435 544 423.1 544 409.7L544 130C544 107 519.8 92 499.2 102.3L489.6 107.1C443.3 130.3 388.8 130.3 342.5 107.1C307.4 89.5 267.1 85.1 229 94.6L144 116L144 88zM144 165.5L240.6 141.3C267.6 134.6 296.1 137.7 321 150.1C375.9 177.5 439.7 179.8 496 156.9L496 398.7L471.6 407.8C437.9 420.4 400.4 418.5 368.2 402.4C320 378.3 264.9 372.3 212.6 385.3L144 402.5L144 165.5z" />
                        </svg>
                      </button>
                      {fUser?.blockedBy.some((u) => u.id == user?.id) ? (
                        <button
                          onClick={() => {
                            unblockedDialogRef.current?.showModal();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 640"
                            className="w-10"
                            stroke="red"
                            strokeWidth={10}
                            fill="none"
                          >
                            <path d="M431.2 476.5L163.5 208.8C141.1 240.2 128 278.6 128 320C128 426 214 512 320 512C361.5 512 399.9 498.9 431.2 476.5zM476.5 431.2C498.9 399.8 512 361.4 512 320C512 214 426 128 320 128C278.5 128 240.1 141.1 208.8 163.5L476.5 431.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z" />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            blockedDialogRef.current?.showModal();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 640 640"
                            fill="#eb4034"
                            className="w-10"
                          >
                            <path d="M431.2 476.5L163.5 208.8C141.1 240.2 128 278.6 128 320C128 426 214 512 320 512C361.5 512 399.9 498.9 431.2 476.5zM476.5 431.2C498.9 399.8 512 361.4 512 320C512 214 426 128 320 128C278.5 128 240.1 141.1 208.8 163.5L476.5 431.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
                <h1 className="text-[1.2rem] text-gray-600">
                  Grade {user?.grade as number}
                </h1>
                <div className="flex gap-2 text-(--secondary-text)">
                  <motion.h1
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      router.push(`/user/followers/${fUser?.id}`);
                    }}
                  >
                    Followers: {fUser?.followers.length}
                  </motion.h1>
                  <motion.h1
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      router.push(`/user/following/${fUser?.id}`);
                    }}
                  >
                    Following: {fUser?.following.length}
                  </motion.h1>
                </div>
              </div>

              <InfiniteScroll
                hasMore={hasMore}
                dataLength={posts.length}
                next={fetchPost}
                loader={
                  <Loading className="flex justify-center items-center w-screen" />
                }
                className="w-3/4 max-[500px]:w-screen px-4 flex flex-col gap-2 items-start mt-20"
              >
                {posts.map((post) => (
                  <Post
                    setPosts={setPosts}
                    post={post}
                    key={post.id as string}
                  />
                ))}
              </InfiniteScroll>
              {errorP && (
                <Error className="text-center my-2 text-[1.4rem] w-screen overflow-x-hidden">
                  {errorP}
                </Error>
              )}
              {error && <Error className="text-center">{error}</Error>}
            </>
          ) : (
            <Error className="text-[1.5rem] text-center flex items-center justify-center pt-40">
              {error}
            </Error>
          )}
        </div>
      )}
      <BlockDialog
        dialogRef={blockedDialogRef as RefObject<HTMLDialogElement>}
        userToBlock={fUser as TUser}
      />
      <UnblockDialog
        dialogRef={unblockedDialogRef as RefObject<HTMLDialogElement>}
        userToUnblock={fUser as TUser}
      />
    </>
  );
}
