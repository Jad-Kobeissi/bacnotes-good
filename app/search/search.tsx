"use client";
import { useState } from "react";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Pagination,
  Configure,
} from "react-instantsearch-dom";
import { algoliasearch } from "algoliasearch";
import Post from "../Post";
import { TPost } from "../types";
import Nav from "../Nav";
import { useUser } from "../contexts/UserContext";

const searchClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export default function Search() {
  const { user } = useUser();
  return (
    <>
      <Nav />
      <div className="pt-20">
        <InstantSearch searchClient={searchClient} indexName="posts">
          {user && <Configure filters={`NOT authorId:${user.id}`} />}

          <div className="flex flex-col items-center justify-center mb-4">
            <SearchBox
              inputId="search"
              className="shadow-md py-1 px-4 rounded-md outline-none"
            />
          </div>
          <div className="w-3/4 flex flex-col items-center justify-center mx-8">
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
    imagesUrl: hit.imagesUrl || [],
    likedUsers: hit.likedUsers || [],
    likes: hit.likes || 0,
    updatedAt: hit.updatedAt,
  };

  return <Post post={post} />;
}
