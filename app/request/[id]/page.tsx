"use client";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import Reply from "@/app/Reply";
import { TReply, TRequest } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function Request({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [request, setRequest] = useState<TRequest | null>(null);
  const [replies, setReplies] = useState<TReply[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [errorReplies, setErrorReplies] = useState("");
  const textarearef = useRef<HTMLTextAreaElement>(null);
  const content = useRef<HTMLInputElement>(null);
  const files = useRef<HTMLInputElement>(null);
  const fetchRequest = () => {
    setLoading(true);
    setError("");
    axios
      .get(`/api/request/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setRequest(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const fetchReplies = () => {
    setErrorReplies("");
    axios
      .get(`/api/replies/${id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setReplies((prev) => {
          const unfilteredReplies = [...prev, ...res.data];
          const filteredReplies = Array.from(
            new Map(unfilteredReplies.map((r) => [r.id, r])).values()
          );

          return filteredReplies;
        });
        setPage((prev) => page + 1);
      })
      .catch((err) => {
        setErrorReplies(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchRequest();
    fetchReplies();
  }, []);
  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="flex items-center justify-center pt-[30vh]" />
      ) : (
        <div>
          {request && (
            <div className="flex flex-col items-center justify-center pt-[30vh] text-center">
              <div>
                <div className="flex gap-2">
                  <h1>Username: {request.author.username}</h1>
                  {request.author.admin && (
                    <h1 className="text-(--secondary-text)">admin</h1>
                  )}
                </div>
                <h1>{request.title}</h1>
                <p className="text-(--secondary-text)">{request.content}</p>
              </div>
              <h1 className="text-(--secondary-text)">
                {request.replies.length} replies
              </h1>
              <h1 className="text-(--secondary-text) mt-3">
                {moment(request.createdAt).fromNow()}
              </h1>
            </div>
          )}
          {!error && (
            <>
              <div className="flex items-center justify-center">
                <form
                  className="border border-gray-300 rounded-lg w-3/4 py-4 px-4 flex justify-between items-center flex-col gap-2 mt-30"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setLoading(true);
                    const formData = new FormData();
                    formData.append(
                      "content",
                      textarearef.current?.value as string
                    );
                    Array.from(files.current?.files || []).map((file) => {
                      formData.append("files", file);
                    });
                    axios
                      .post(`/api/reply/${id}`, formData, {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      })
                      .then((res) => {
                        alert("posted");
                        if (textarearef.current) textarearef.current.value = "";
                        if (files.current) files.current.value = "";
                        setReplies(res.data);
                      })
                      .catch((err) => {
                        alert("Error posting reply");
                      })
                      .finally(() => setLoading(false));
                  }}
                >
                  <div className="w-full">
                    <textarea
                      ref={textarearef}
                      onInput={(e) => {
                        const el = textarearef.current;
                        if (!el) return;
                        el.style.height = "auto";
                        el.style.height = el.scrollHeight + "px";
                      }}
                      placeholder="Whats on your mind?"
                      className="flex items-center placeholder:items-center h-auto w-full"
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="text-(--brand)">
                      <label
                        htmlFor="file"
                        className="flex gap-2 p-1 rounded-md"
                      >
                        <img
                          src="/customSvgs/image.svg"
                          className="w-[1.6rem]"
                        />
                        <h1>Photo</h1>
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
                  </div>
                </form>
              </div>
              <InfiniteScroll
                dataLength={replies.length}
                hasMore={hasMore}
                next={fetchReplies}
                loader={
                  <Loading className="flex items-center justify-center mt-[30vh]" />
                }
                className="w-full flex flex-col items-center gap-2 mt-20"
              >
                {replies.map((reply) => (
                  <Reply
                    reply={reply}
                    key={reply.id as string}
                    setReplies={setReplies}
                  />
                ))}
              </InfiniteScroll>
              {errorReplies && (
                <Error className="text-center pt-20">{errorReplies}</Error>
              )}
            </>
          )}
          {error && (
            <Error className="text-[1.2rem] text-center pt-[50vh]">
              {error}
            </Error>
          )}
        </div>
      )}
    </>
  );
}
