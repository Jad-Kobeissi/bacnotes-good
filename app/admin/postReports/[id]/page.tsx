"use client";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import { TPostReport } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PostReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [report, setReport] = useState<TPostReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = React.use(params);
  const router = useRouter();
  const fetchReport = () => {
    setLoading(true);
    axios
      .get(`/api/posts/reports/report/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchReport();
  }, []);
  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="flex items-center justify-center pt-40" />
      ) : error ? (
        <Error className="text-center text-[1.2rem] pt-40">{error}</Error>
      ) : (
        <div
          key={report?.id as string}
          className="p-4 mb-4 rounded-md mx-4 pt-20 flex items-center justify-center flex-col pt-[30vh] text-center"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/admin/postReports/${report?.id}`);
          }}
        >
          <p className="mb-1">Reported by: {report?.reporter.username}</p>
          <p>Post Id: {report?.post.id}</p>
          <p className="mb-1">Post Title: {report?.post?.title}</p>
          <p className="mb-1">Post content: {report?.post?.content}</p>
          <p>Reports Number: {report?.post?.reports.length}</p>
          <div className="w-full flex justify-center">
            <div className="flex max-[600px]:w-[120%] max-[400px]:w-[200%] w-1/2 overflow-x-auto snap-x snap-mandatory gap-4 items-center">
              {report?.post?.imagesUrl.map((image, key) => (
                <img
                  src={image as string}
                  key={key}
                  className="snap-center rounded-md"
                />
              ))}
            </div>
          </div>
          <button
            className="bg-(--brand) text-background px-4 py-1 rounded-md"
            onClick={() => {
              axios
                .delete(`/api/posts/${report?.postId}`, {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                })
                .then((res) => {
                  alert("Post deleted successfully");
                  router.push("/admin/postReports");
                })
                .catch((err) => {
                  console.log(err);
                  alert("Error deleting post");
                });
            }}
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}
