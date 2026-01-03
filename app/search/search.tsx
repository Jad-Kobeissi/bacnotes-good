"use client";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
} from "react-instantsearch-dom";
import { algoliasearch } from "algoliasearch";
import { TPost } from "../types";
import Nav from "../Nav";
import { useUser } from "../contexts/UserContext";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export default function Search() {
  const { user } = useUser();
  const router = useRouter();
  return (
    <>
      <Nav />
      <div className="pt-20 flex items-center justify-center flex-col gap-4 pt-[10vh]">
        <InstantSearch
          searchClient={searchClient}
          indexName={process.env.NEXT_PUBLIC_POSTS_INDEX_NAME!}
        >
          {user && <Configure filters={`NOT authorId:${user.id}`} />}

          <div className="flex flex-col items-center justify-center mb-4">
            <SearchBox
              inputId="search"
              className="shadow-md py-1 px-4 rounded-md outline-none"
            />
          </div>
          <div className="flex gap-6">
            <button onClick={() => router.push(`/search`)}>Posts</button>
            <button
              onClick={() => router.push(`/search/requests`)}
              className="text-(--secondary-text)"
            >
              Requests
            </button>
            <button
              onClick={() => router.push(`/search/user`)}
              className="text-(--secondary-text)"
            >
              Users
            </button>
          </div>
          <div className="w-screen flex flex-col items-center justify-center mx-8 gap-2">
            <Hits hitComponent={PostHit} />
          </div>
        </InstantSearch>
      </div>
    </>
  );
}

export function PostHit({ hit }: { hit: any }) {
  const post: TPost = {
    id: hit.objectID,
    title: hit.title,
    content: hit.content,
    authorId: hit.authorId,
    createdAt: hit.createdAt,
    author: hit.author,
    subject: hit.subject,
    imagesUrl: hit.imagesUrl || [],
    likedUsers: hit.likedUsers || [],
    likes: hit.likes || 0,
    updatedAt: hit.updatedAt,
  };
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/post/${post.id}`)}
      key={post.id as string}
      className="border border-gray-300 flex flex-col gap-2 items-start justify-center rounded-lg p-20 px-25 w-3/4 mx-4"
    >
      <div className="flex gap-4 items-center">
        <div className="flex gap-2">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/user/${post.author.id}`);
            }}
            className="text-[1rem] underline cursor-pointer text-(--brand) font-semibold"
          >
            {post.author.username}
          </motion.h1>
          {post.author.admin && (
            <h1 className="text-(--secondary-text)">admin</h1>
          )}
        </div>
      </div>
      {post.title && (
        <h2 className="font-semibold text-[1.5rem]">{post.title}</h2>
      )}
      <p className="font-medium text-(--secondary-text) w-full">
        {post.content}
      </p>
      <div className="w-full flex justify-center">
        <div className="flex max-[600px]:w-[120%] max-[400px]:w-[200%] w-1/2 overflow-x-auto snap-x snap-mandatory gap-4 items-center">
          {post.imagesUrl.map((image, key) => (
            <img
              src={image as string}
              key={key}
              className="snap-center rounded-md"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
