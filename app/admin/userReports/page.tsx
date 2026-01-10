"use client";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import { TReplyReport, TRequestReport, TUserReport } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { report } from "process";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function UserReportsPage() {
  const [reports, setReports] = useState<TUserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const fetchReports = async () => {
    axios
      .get(`/api/user/reports/?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setReports((prev) => {
          const unfiltered = [...prev, ...res.data];

          const filterd = new Map(unfiltered.map((item) => [item.id, item]));
          return Array.from(filterd.values());
        });
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setError(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <>
      <Nav />
      <div className="pt-30">
        <h1 className="text-center text-[1.2rem] my-10">User Reports</h1>
        <InfiniteScroll
          dataLength={reports.length}
          next={fetchReports}
          hasMore={hasMore}
          loader={
            <Loading className="flex items-center justify-center mt-20" />
          }
        >
          {reports.map((report) => (
            <div
              key={report.id as string}
              className="border border-gray-300 p-4 mb-4 rounded-md mx-4"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/replyReports/${report.id}`);
              }}
            >
              <p className="mb-1">Reported by: {report.user.username}</p>
              <div className="flex gap-4 w-full">
                <button
                  className="bg-(--brand) text-background py-1 px-2 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    axios
                      .delete(`/api/user/${report?.userId}`, {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      })
                      .then((res) => {
                        alert("User deleted successfully");
                        setReports((prev) =>
                          prev.filter((r) => r.id !== report.id)
                        );
                      })
                      .catch((err) => {
                        console.log(err);
                        alert("Error deleting User: " + err.response.data);
                      });
                  }}
                >
                  Delete User
                </button>
                <button
                  className="bg-(--brand) text-background py-1 px-2 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    axios
                      .delete(`/api/user/report/${report.id}`, {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      })
                      .then((res) => {
                        alert("Report deleted");
                        setReports((prev) =>
                          prev.filter((r) => r.id !== report.id)
                        );
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
          ))}
          {error && <Error className="text-center">{error}</Error>}
        </InfiniteScroll>
      </div>
    </>
  );
}
