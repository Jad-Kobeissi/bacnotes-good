"use client";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
} from "react-instantsearch-dom";
import { algoliasearch } from "algoliasearch";
import { TPost, TRequest } from "../../types";
import Nav from "../../Nav";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import moment from "moment";
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
          indexName={process.env.NEXT_PUBLIC_REQUESTS_INDEX_NAME!}
        >
          {user && <Configure filters={`NOT authorId:${user.id}`} />}

          <div className="flex flex-col items-center justify-center mb-4">
            <SearchBox
              inputId="search"
              className="shadow-md py-1 px-4 rounded-md outline-none"
            />
          </div>
          <div className="flex gap-6">
            <button
              onClick={() => router.push(`/search`)}
              className="text-(--secondary-text)"
            >
              Posts
            </button>
            <button onClick={() => router.push(`/search/requests`)}>
              Requests
            </button>
            <button
              onClick={() => router.push(`/search/user`)}
              className="text-(--secondary-text)"
            >
              Users
            </button>
          </div>
          <div className="w-screen flex flex-col items-center justify-center gap-2">
            <Hits hitComponent={RequestHit} />
          </div>
        </InstantSearch>
      </div>
    </>
  );
}

export function RequestHit({ hit }: { hit: any }) {
  const request: TRequest = {
    id: hit.objectID,
    title: hit.title,
    content: hit.content,
    authorId: hit.authorId,
    createdAt: hit.createdAt,
    author: hit.author,
    subject: hit.subject,
    replies: hit.replies,
    updatedAt: hit.updatedAt,
  };
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/request/${request.id}`)}
      key={request.id as string}
      className="border border-gray-300 flex flex-col gap-2 items-start justify-center rounded-lg p-20 px-25 w-full "
    >
      <div className="flex gap-4 items-center">
        <motion.h1
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/user/${request.author.id}`);
          }}
          className="text-[1rem] underline cursor-pointer text-(--brand) font-semibold"
        >
          {request.author.username}
        </motion.h1>
        {request.author.admin && (
          <h1 className="text-(--secondary-text)">admin</h1>
        )}
      </div>
      {request.title && (
        <h2 className="font-semibold text-[1.5rem]">{request.title}</h2>
      )}
      <p className="font-medium text-(--secondary-text) w-full">
        {request.content}
      </p>
      <div className="flex gap-2 items-center text-(--brand) p-2 border-(--brand) rounded-lg">
        <img src="/customSvgs/book.svg" alt="Book" className="w-6" />
        <p className="text-[1rem]">{request.subject.toLocaleLowerCase()}</p>
      </div>
      <h1 className="text-(--secondary-text)">
        {request.replies.length} replies
      </h1>
      <h1 className="text-(--secondary-text)">
        {moment(request.createdAt).fromNow()}
      </h1>
    </div>
  );
}
