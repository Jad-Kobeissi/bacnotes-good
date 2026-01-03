"use client";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Configure,
} from "react-instantsearch-dom";
import { algoliasearch } from "algoliasearch";
import { TUser } from "../../types";
import { motion } from "motion/react";
import Nav from "../../Nav";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "next/navigation";
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
          indexName={process.env.NEXT_PUBLIC_USERS_INDEX_NAME!}
        >
          {user && <Configure filters={`NOT id:${user.id}`} />}

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
            <button
              onClick={() => router.push(`/search/requests`)}
              className="text-(--secondary-text)"
            >
              Requests
            </button>
            <button onClick={() => router.push(`/search/user`)}>Users</button>
          </div>
          <div className="w-screen flex flex-col items-center justify-center mx-8 gap-2">
            <Hits hitComponent={UserHit} />
          </div>
        </InstantSearch>
      </div>
    </>
  );
}

export function UserHit({ hit }: { hit: any }) {
  const user: TUser = {
    id: hit.objectID,
    username: hit.username,
    email: hit.email,
    admin: hit.admin || false,
    createdAt: hit.createdAt,
    followers: hit.followers || [],
    following: hit.following || [],
    password: hit.password,
    posts: hit.posts || [],
    requests: hit.requests || [],
    replies: hit.replies || [],
    likedPosts: hit.likedPosts || [],
    likedReplies: hit.likedReplies || [],
    PostReports: hit.PostReports || [],
    ReplyReports: hit.ReplyReports || [],
    RequestReports: hit.RequestReports || [],
    updatedAt: hit.updatedAt,
    viewedPosts: hit.viewedPosts || [],
  };
  const router = useRouter();
  return (
    <motion.div
      onClick={() => router.push(`/user/${user.id}`)}
      className="border border-gray-300 px-6 py-2 rounded-md flex flex-col items-center justify-center gap-2"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="flex gap-2">
        <h1>{user.username}</h1>
        {user.admin && <h1 className="text-(--secondary-text)">admin</h1>}
      </div>
      <div className="flex gap-2 text-(--secondary-text) items-center">
        <h1>Followers: {user.followers.length}</h1>
        <h1>Following: {user.following.length}</h1>
      </div>
    </motion.div>
  );
}
