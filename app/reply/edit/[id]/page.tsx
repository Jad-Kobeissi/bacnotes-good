"use client";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function ReplyEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const files = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const fetchReply = () => {
    setLoading(true);
    setError("");
    axios
      .get(`/api/reply/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setContent(res.data.content);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchReply();
  }, []);
  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="flex items-center justify-center h-screen" />
      ) : (
        <form
          className="flex flex-col gap-3 items-center justify-center h-screen"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            const formData = new FormData();
            formData.append("content", content);
            Array.from(files.current?.files || []).map((file) => {
              formData.append("files", file);
            });
            axios
              .put(`/api/reply/${id}`, formData, {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              })
              .then((res) => {
                setLoading(true);
                alert("Reply Updated");
                router.push(`/reply/${id}`);
              })
              .catch((err) => {
                setError(err.response.data);
              })
              .finally(() => setLoading(false));
          }}
        >
          <h1 className="text-[1.2rem] font-semibold">Editing Reply</h1>
          <input
            type="text"
            className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <input
            type="file"
            multiple
            accept="image/*"
            className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
            ref={files}
          />
          <button className="bg-(--blue) text-white px-4 py-1 rounded-md hover:bg-transparent border border-(--blue) hover:text-(--blue) active:bg-transparent active:text-(--blue) transition-all duration-200">
            Edit Page
          </button>
        </form>
      )}
    </>
  );
}
