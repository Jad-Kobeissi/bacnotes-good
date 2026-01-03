"use client";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import { TPostReport, TRequestReport } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function PostReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [report, setReport] = useState<TRequestReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = React.use(params);
  const router = useRouter();
  const fetchReport = () => {
    setLoading(true);
    axios
      .get(`/api/request/report/${id}`, {
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
          <p>Request Id: {report?.request.id}</p>
          <p>Request Title: {report?.request.title}</p>
          <p>Request Content: {report?.request.content}</p>
          <div className="flex gap-2">
            <button
              className="bg-(--brand) text-background py-1 px-2 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                axios
                  .delete(`/api/request/${report?.requestId}`, {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  })
                  .then((res) => {
                    alert("Request deleted successfully");
                    router.push("/admin/requestReports");
                  })
                  .catch((err) => {
                    console.log(err);
                    alert("Error deleting Request");
                  });
              }}
            >
              Delete Request
            </button>
            <button
              className="bg-(--brand) text-background py-1 px-2 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                axios
                  .delete(`/api/request/report/${report?.id}`, {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  })
                  .then((res) => {
                    alert("Report deleted");
                    router.push("/admin/requestReports");
                  })
                  .catch((err) => {
                    alert("Error deleting report");
                  });
              }}
            >
              Delete Report
            </button>
          </div>
        </div>
      )}
    </>
  );
}
