"use client";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import { TPost } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [post, setPost] = useState<TPost | null>(null);
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
  return (
    <>
      <Nav />
      {loading ? (
        <Loading />
      ) : !post ? (
        <Loading />
      ) : (
        <div className="pt-[20vh] flex items-center justify-center flex-col gap-2">
          {post.title && (
            <h1 className="font-semibold text-[2rem]">{post.title}</h1>
          )}
          <h1 className="text-[1.2rem]">{post.content}</h1>
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
        </div>
      )}
      {error && <Error>{error}</Error>}
    </>
  );
}
