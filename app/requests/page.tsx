"use client";
import { useRouter } from "next/navigation";
import Nav from "../Nav";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";
import { TRequest } from "../types";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../Loading";
import Error from "../Error";
import moment from "moment";
import Request from "../Request";

export default function Requests() {
  const router = useRouter();
  const title = useRef<HTMLInputElement | null>(null);
  const textarearef = useRef<HTMLTextAreaElement | null>(null);
  const [subject, setSubject] = useState<String>("");
  const [requests, setRequests] = useState<TRequest[]>([]);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const handleInput = () => {
    const el = textarearef.current;
    if (!el) return;
    el.style.height = el.scrollHeight + "px";
  };
  const fetchRequests = () => {
    axios
      .get(`/api/request`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setRequests((prev) => {
          const unfiltered = [...prev, ...res.data];
          const filtered = new Map(unfiltered.map((r) => [r.id, r])).values();

          return Array.from(filtered);
        });
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchRequests();
  }, []);
  return (
    <>
      <Nav />
      <div className="pt-[10vh] flex flex-col gap-8">
        <div className="flex gap-8 justify-center mb-10">
          <button
            className="text-(--secondary-text)"
            onClick={() => {
              router.push("/home");
            }}
          >
            Posts
          </button>
          <button
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
              axios
                .post(
                  `/api/request`,
                  {
                    title: title.current?.value,
                    content: textarearef.current?.value,
                    subject,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .then((res) => {
                  alert("Request Added");
                  if (title.current) title.current.value = "";
                  if (textarearef.current) textarearef.current.value = "";
                  setSubject("");
                })
                .catch((err) => {
                  alert(err.response.data);
                });
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
                value={subject as string}
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
            <button className="bg-(--brand) text-background px-4 py-1 rounded-md border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200 ">
              Post
            </button>
          </form>
          <button
            onClick={() => router.push("/search/requests")}
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
        </div>
        <div className="flex w-3/4 max-[600px]:w-full items-center justify-center">
          <select
            name="subject"
            id="subject"
            className="border border-(--brand) px-4 py-1 rounded-md text-(--brand)"
            onChange={(e) => {
              router.push(`/requests/subject/${e.target.value}`);
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
          dataLength={requests.length}
          loader={
            <Loading className="flex items-center justify-center mt-[30vh]" />
          }
          hasMore={hasMore}
          next={fetchRequests}
          className="w-3/4 mx-8"
        >
          {requests.map((request) => (
            <Request request={request} key={request.id as string} />
          ))}
        </InfiniteScroll>
        {error && <Error className="text-center mt-20">{error}</Error>}
      </div>
    </>
  );
}
