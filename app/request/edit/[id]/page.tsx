"use client";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import { TRequest } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function editRequest({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { id } = React.use(params);
  const fetchRequest = () => {
    setLoading(true);
    axios
      .get(`/api/request/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchRequest();
  }, []);

  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="w-screen pt-[50vh] flex items-center justify-center" />
      ) : (
        <div className="pt-30 flex flex-col gap-2">
          <h1 className="text-center text-[1.2rem]">Editing Request</h1>
          <form
            className="flex flex-col gap-4 items-center justify-center mt-20"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              axios
                .put(
                  `/api/request/${id}`,
                  {
                    title,
                    content,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .then((res) => {
                  alert("Request Updated");
                  router.push("/profile");
                })
                .catch((err) => {
                  setError(err.response.data);
                })
                .finally(() => setLoading(false));
            }}
          >
            <input
              type="text"
              placeholder="Title"
              className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Content"
              className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button className="bg-(--brand) text-background rounded-md mx-4 px-4 py-1 border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200 flex items-center justify-center font-semibold gap-2 group">
              Confirm
            </button>
          </form>
        </div>
      )}
    </>
  );
}
