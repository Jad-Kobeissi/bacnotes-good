"use client";
import { useUser } from "@/app/contexts/UserContext";
import Error from "@/app/Error";
import Loading from "@/app/Loading";
import Nav from "@/app/Nav";
import Post from "@/app/Post";
import { TPost, TUser } from "@/app/types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

export default function User({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { user } = useUser();
  const router = useRouter();
  const [fUser, setFUser] = useState<TUser | null>(null);
  const [posts, setPosts] = useState<TPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [errorP, setErrorP] = useState<string | null>(null);
  const fetchUser = () => {
    axios
      .get(`/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setFUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError(() => {
          console.log(err.response.data);

          return err.response.data;
        });
      });
  };
  const fetchPost = () => {
    axios
      .get(`/api/posts/user/${id}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data]);
        setPage((prev) => prev + 1);
      })
      .catch((err) => {
        setErrorP(err.response.data);
        setHasMore(false);
      });
  };
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    if (!fUser) return;
    fetchPost();
  }, [fUser]);
  return (
    <>
      <Nav />
      <div className="pt-25">
        {!error ? (
          <>
            <div className="pt-25 flex flex-col items-center justify-center gap-2">
              <h1 className="text-[1.5rem] font-semibold">{fUser?.username}</h1>
              <div className="flex gap-2 text-(--secondary-text)">
                <h1
                  onClick={() => {
                    router.push(`/user/${fUser?.id}/followers`);
                  }}
                >
                  Followers: {fUser?.followers.length}
                </h1>
                <h1
                  onClick={() => {
                    router.push(`/user/${fUser?.id}/following`);
                  }}
                >
                  Following: {fUser?.following.length}
                </h1>
              </div>
            </div>

            <InfiniteScroll
              hasMore={hasMore}
              dataLength={posts.length}
              next={fetchPost}
              loader={
                <Loading className="flex justify-center items-center w-3/4 mx-40" />
              }
              className="w-3/4 max-[500px]:w-screen px-4 flex flex-col gap-2 items-start mt-20"
            >
              {posts.map((post) => (
                <Post post={post} key={post.id as string} />
              ))}
              {errorP && (
                <Error className="text-center my-2 w-full text-[1.4rem]">
                  {errorP}
                </Error>
              )}
            </InfiniteScroll>
            {error && <Error className="text-center">{error}</Error>}
          </>
        ) : (
          <Error className="text-[1.5rem] text-center flex items-center justify-center pt-40">
            {error}
          </Error>
        )}
      </div>
    </>
  );
}
