"use client";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import Post from "@/app/Post";
import Request from "@/app/Request";
import { TPost, TRequest } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = React.use(params);
  const [requests, setRequests] = useState<TRequest[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const fetchRequests = () => {
    axios
      .get(`/api/request/subject/${subject}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setRequests((prev) => {
          const unfiltered = [...prev, ...res.data];
          const filteredRequests = Array.from(
            new Map<string, TRequest>(
              unfiltered.map((p) => [p.id, p]) as any
            ).values()
          );
          return filteredRequests;
        });
        setPage((prev) => prev + 1);
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
      <div className="pt-[30vh]">
        <h1 className="text-[1.5rem] my-15 text-center">
          Viewing {subject.toLowerCase()} requests
        </h1>
        <InfiniteScroll
          dataLength={requests.length}
          hasMore={hasMore}
          next={fetchRequests}
          loader={
            <Loading className="flex items-center justify-center pt-20" />
          }
          className="flex items-center justify-center flex-col gap-2 mx-4"
        >
          {requests.map((request) => (
            <Request key={request.id as string} request={request} />
          ))}
        </InfiniteScroll>
        {error && (
          <Error className="text-[1.4rem] my-10 text-center">{error}</Error>
        )}
      </div>
    </>
  );
}
