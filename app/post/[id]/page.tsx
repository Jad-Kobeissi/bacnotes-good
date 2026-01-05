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
                  className="bg-(--brand) px-4 py-1 rounded-md text-background border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200"
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
                  Dislike
                </button>
              ) : (
                <button
                  className="bg-(--brand) px-4 py-1 rounded-md text-background border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200"
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
                  Like
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
