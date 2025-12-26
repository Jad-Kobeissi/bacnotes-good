"use client";
import Error from "@/app/Error";
import Nav from "@/app/Nav";
import { TPost } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [post, setPost] = useState<TPost | null>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const files = useRef<HTMLInputElement>(null);
  const fetchPost = () => {
    setLoading(true);
    axios
      .get(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPost(res.data);
        setTitle(res.data.title as string);
        setContent(res.data.content as string);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchPost();
  }, []);
  const router = useRouter();
  return (
    <>
      <Nav />
      <form
        className="pt-20 flex flex-col items-center justify-center h-screen gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          const formData = new FormData();
          formData.append("title", title);
          formData.append("content", content);
          if (files.current?.files && files.current.files.length > 0) {
            Array.from(files.current?.files).forEach((file) => {
              formData.append("files", file);
            });
          }
          axios
            .put(`/api/posts/${post?.id}`, formData, {
              headers: {
                Authorization: `Bearer ${getCookie("token")}`,
              },
            })
            .then((res) => {
              alert("Updated");
              router.push(`/post/${post?.id}`);
            })
            .catch((err) => {
              alert(err.response.data);
            })
            .finally(() => setLoading(false));
        }}
      >
        <h1 className="text-[1.3rem] font-semibold text-center">Edit Post</h1>
        {error && <Error className="text-center">{error}</Error>}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-[1.2rem] font-bold">
            Edit Title
          </label>
          <input
            type="text"
            placeholder={title as string}
            id="title"
            className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
            value={title as string}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="username" className="text-[1.2rem] font-bold">
            Content
          </label>
          <textarea
            id="username"
            className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
            value={content as string}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="files" className="text-[1.2rem] font-bold">
            Images
          </label>
          <input
            type="file"
            multiple
            id="files"
            className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
            ref={files}
          />
        </div>
        <button className="bg-(--blue) text-background flex px-3 py-1 text-[1.2rem] gap-2 rounded-md font-semibold border border-(--blue) group hover:text-(--blue) hover:bg-transparent transition-all duration-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            fill="currentColor"
            className="w-5 fill-white group-hover:fill-(--blue)"
          >
            <path d="M160 96C124.7 96 96 124.7 96 160L96 480C96 515.3 124.7 544 160 544L480 544C515.3 544 544 515.3 544 480L544 237.3C544 220.3 537.3 204 525.3 192L448 114.7C436 102.7 419.7 96 402.7 96L160 96zM192 192C192 174.3 206.3 160 224 160L384 160C401.7 160 416 174.3 416 192L416 256C416 273.7 401.7 288 384 288L224 288C206.3 288 192 273.7 192 256L192 192zM320 352C355.3 352 384 380.7 384 416C384 451.3 355.3 480 320 480C284.7 480 256 451.3 256 416C256 380.7 284.7 352 320 352z" />
          </svg>{" "}
          Save Changes
        </button>
      </form>
    </>
  );
}
