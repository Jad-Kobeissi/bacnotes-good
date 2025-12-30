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
