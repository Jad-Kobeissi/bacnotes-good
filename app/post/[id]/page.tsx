"use client";
import Error from "@/app/Error";
import moment from "moment";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import { TPost } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useUser } from "@/app/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const [post, setPost] = useState<TPost | null>(null);
  const [following, setFollowing] = useState<boolean | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [likes, setLikes] = useState<number>(post?.likes as number);
  const { user, setUser } = useUser();
  const router = useRouter();
  const fetchPosts = () => {
    setError("");
    setLoading(true);
    axios
      .get(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPost(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setTimeout(() => {
      fetchPosts();
    }, 0);
  }, []);
  useEffect(() => {
    if (!user || !post) return;

    if (user.following.some((u) => u.id === post.author.id)) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }

    if (post.likedUsers.some((u) => u.id === user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
    setLikes(post.likes as number);
  }, [post, user]);
  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="w-screen pt-[30vh] flex items-center justify-center" />
      ) : (
        post && (
          <div className="pt-[20vh] flex items-center justify-center flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <motion.h1
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-[1rem] font-semibold underline cursor-pointer text-(--brand)"
                >
                  {post.author.username}
                </motion.h1>
                {post.author.admin && (
                  <h1 className="text-(--secondary-text)">admin</h1>
                )}
              </div>
              {post.authorId == user?.id ? null : following ? (
                <button
                  className="bg-(--brand) px-4 py-1 rounded-md text-background border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    axios
                      .post(
                        `/api/user/unfollow/${post.author.id}`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${getCookie("token")}`,
                          },
                        }
                      )
                      .then((res) => {
                        setFollowing(false);
                        setUser(res.data);
                      })
                      .catch((err) => {
                        setFollowing(false);
                        alert("Error unfollowing user");
                      });
                  }}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="bg-(--brand) px-4 py-1 rounded-md text-background border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    axios
                      .post(
                        `/api/user/follow/${post.author.id}`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${getCookie("token")}`,
                          },
                        }
                      )
                      .then((res) => {
                        setFollowing(true);
                        setUser(res.data);
                      })
                      .catch((err) => {
                        alert("Error following user");
                        setFollowing(false);
                      });
                  }}
                >
                  Follow
                </button>
              )}
            </div>
            {post.title && (
              <h1 className="font-semibold text-[2rem]">{post.title}</h1>
            )}
            <p className="text-[1.1rem] text-(--secondary-text)">
              {post.content}
            </p>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory mt-4 w-1/4 max-[700px]:w-full">
              {post.imagesUrl.map((url) => (
                <img
                  src={url as string}
                  alt="Post Image"
                  key={url as string}
                  className="snap-center w-[60rem]  object-cover"
                />
              ))}
            </div>
            <div className="flex gap-4 items-center">
              <h1>{likes as number}</h1>
              {liked ? (
                <button
                  className="border border-(--brand) rounded-full p-2 group hover:bg-(--brand) hover:text-background active:bg-(--brand) active:text-background transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLiked(false);
                    setLikes((prev) => prev - 1);
                    axios
                      .post(
                        `/api/posts/dislike/${post.id}`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${getCookie("token")}`,
                          },
                        }
                      )
                      .then(() => {})
                      .catch((err) => {
                        alert("Error disliking post");
                        setLiked(false);
                        setLikes((prev) => prev + 1);
                      });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    stroke="currentColor"
                    strokeWidth="38"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="currentColor"
                    className="fill-(--brand) w-5 text-(--brand) group-hover:fill-none transition-all duration-200 group-active:fill-none group-hover:text-background group-active:text-background"
                  >
                    <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
                  </svg>
                </button>
              ) : (
                <button
                  className="bg-(--brand) px-2 py-2 rounded-full text-background border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200 group"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLiked(true);
                    setLikes((prev) => prev + 1);
                    axios
                      .post(
                        `/api/posts/like/${post.id}`,
                        {},
                        {
                          headers: {
                            Authorization: `Bearer ${getCookie("token")}`,
                          },
                        }
                      )
                      .then(() => {})
                      .catch((err) => {
                        alert("Error liking post");
                        setLiked(false);
                        setLikes((prev) => prev - 1);
                      });
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    stroke="currentColor"
                    strokeWidth="38"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="fill-white w-5 group-hover:fill-(--brand) transition-all duration-200 text-white group-hover:text-(--brand) group-active:text-(--brand)"
                  >
                    <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
                  </svg>
                </button>
              )}
            </div>
            <h1 className="text-(--secondary-text)">
              {moment(post.createdAt).fromNow()}
            </h1>
            {post.authorId == user?.id ? (
              <button
                className="bg-(--brand) px-4 py-1 rounded-md text-background border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200 disabled:bg-red-300 disabled:border-red-300 disabled:text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeleteDisabled(true);
                  axios
                    .delete(`/api/posts/${post.id}`, {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    })
                    .then((res) => {
                      alert("Post deleted successfully");
                      router.push(`/profile`);
                    })
                    .catch((err) => {
                      console.log(err);
                      alert("Error deleting post");
                    })
                    .finally(() => setDeleteDisabled(false));
                }}
                disabled={deleteDisabled}
              >
                Delete
              </button>
            ) : null}
          </div>
        )
      )}
      {error && (
        <Error className="text-center text-[1.5rem] pt-[20vh]">{error}</Error>
      )}
    </>
  );
}
