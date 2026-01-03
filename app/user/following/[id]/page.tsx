"use client";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import { TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Followers({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const [following, setFollowing] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const fetchFollowing = () => {
    setLoading(true);
    setError("");
    axios
      .get(`/api/user/following/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setFollowing(res.data);
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchFollowing();
  }, []);
  return (
    <>
      <Nav />
      {loading ? (
        <Loading className="w-screen h-screen flex items-center justify-center" />
      ) : (
        <div className="pt-[20vh]">
          <h1 className="text-[2rem] text-center font-semibold mb-20">
            Following
          </h1>
          <div className="flex flex-col items-center justify-center">
            {following.map((user) => (
              <div
                className="border p-10 px-20 border-gray-300 rounded-lg flex flex-col items-center"
                key={user.id as string}
                onClick={() => router.push(`/user/${user.id}`)}
              >
                <div className="flex gap-2">
                  <h1>{user.username}</h1>
                  {user.admin && (
                    <h1 className="text-(--secondary-text)">admin</h1>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Error className="text-center text-[1.2rem]">{error}</Error>
        </div>
      )}
    </>
  );
}
