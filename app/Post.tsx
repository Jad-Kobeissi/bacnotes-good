import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { TPost } from "./types";
import moment from "moment";
import { useUser } from "./contexts/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

export default function Post({ post }: { post: TPost }) {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [following, setFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user || !post) return;

    if (user.following.some((u) => u.id === post.author.id)) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [user, post]);
  return (
    <div
      onClick={() => router.push(`/post/${post.id}`)}
      key={post.id as string}
      className="border border-gray-300 flex flex-col gap-2 items-start justify-center rounded-lg p-20 max-[380px]:p-5 w-full"
    >
      <div className="flex gap-4 items-center">
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
        {following ? (
          <button
            className="bg-(--brand) px-4 py-1 rounded-md text-background border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              axios
                .post(
                  `/api/user/unfollow/${post.author.id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .then((res) => {
                  setFollowing(false);
                  alert(`Unfollowed ${post.author.username} successfully`);
                  setUser(res.data);
                })
                .catch((err) => {
                  setFollowing(false);
                  alert("Error unfollowing user");
                });
            }}
          >
            Unfollow
          </button>
        ) : (
          <button
            className="bg-(--brand) px-4 py-1 rounded-md text-background border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              axios
                .post(
                  `/api/user/follow/${post.author.id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .then((res) => {
                  setFollowing(true);
                  alert(`Followed ${post.author.username} successfully`);
                  setUser(res.data);
                })
                .catch((err) => {
                  alert("Error following user");
                  setFollowing(false);
                });
            }}
          >
            Follow
          </button>
        )}
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
      <h1 className="text-(--secondary-text)">
        {moment(post.createdAt).fromNow()}
      </h1>
    </div>
  );
}
