import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { TPost } from "./types";
import moment from "moment";
import { useUser } from "./contexts/UserContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { getCookie } from "cookies-next";

export default function Post({
  post,
  setPosts,
}: {
  post: TPost;
  setPosts?: React.Dispatch<React.SetStateAction<TPost[]>>;
}) {
  const router = useRouter();
  const { user, setUser } = useUser();
  const [following, setFollowing] = useState<boolean | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [likes, setLikes] = useState<number>(post.likes as number);
  useEffect(() => {
    if (!user || !post) return;

    if (user.following.some((u) => u.id === post.author.id)) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }

    if (post.likedUsers.some((u) => u.id === user.id)) {
      setLiked(true);
    } else {
      setLiked(false);
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
        {user && user.id === post.authorId ? null : following ? (
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
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <h1>{likes as number}</h1>
          {liked ? (
            <div
              className="border border-(--brand) rounded-full p-2 group hover:bg-(--brand) hover:text-background active:bg-(--brand) active:text-background transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setLiked(false);
                setLikes((prev) => prev - 1);
                axios
                  .post(
                    `/api/posts/dislike/${post.id}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    }
                  )
                  .then(() => {
                    alert("Post disliked");
                  })
                  .catch((err) => {
                    alert("Error disliking post");
                    setLiked(false);
                    setLikes((prev) => prev + 1);
                  });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                stroke="currentColor"
                strokeWidth="38"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="currentColor"
                className="fill-(--brand) w-5 text-(--brand) group-hover:fill-none transition-all duration-200 group-active:fill-none group-hover:text-background group-active:text-background"
              >
                <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
              </svg>
            </div>
          ) : (
            <div
              className="bg-(--brand) border border-(--brand) rounded-full p-2 group hover:bg-transparent active:bg-transparent transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                setLiked(true);
                setLikes((prev) => prev + 1);
                axios
                  .post(
                    `/api/posts/like/${post.id}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    }
                  )
                  .then(() => {
                    alert("Post liked");
                  })
                  .catch((err) => {
                    alert("Error liking post");
                    setLiked(false);
                    setLikes((prev) => prev - 1);
                  });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 640 640"
                stroke="currentColor"
                strokeWidth="38"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="fill-white w-5 group-hover:fill-none transition-all duration-200 text-white group-hover:text-(--brand) group-active:text-(--brand)"
              >
                <path d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      {post.authorId == user?.id ? (
        <button
          className="bg-(--brand) px-4 py-1 rounded-md text-background border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            axios
              .delete(`/api/posts/${post.id}`, {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              })
              .then((res) => {
                alert("Post deleted successfully");
                setPosts &&
                  setPosts((posts) => posts.filter((p) => p.id !== post.id));
              })
              .catch((err) => {
                console.log(err);
                alert("Error deleting post");
              });
          }}
        >
          Delete
        </button>
      ) : null}
      <h1 className="text-(--secondary-text)">
        {moment(post.createdAt).fromNow()}
      </h1>
    </div>
  );
}
