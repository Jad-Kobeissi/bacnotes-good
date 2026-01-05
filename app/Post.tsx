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
  const [deleteDisabled, setDeleteDisabled] = useState(false);
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
      className="border border-gray-300 flex flex-col gap-2 items-start justify-center rounded-lg p-20 max-[380px]:p-5 max-[422px]:w-screen "
    >
      <div className="flex gap-4 items-center justify-between w-full">
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
        {post.authorId != user?.id && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              axios
                .post(
                  `/api/posts/reports/${post.id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .then((res) => {
                  alert("Post reported successfully");

                  if (setPosts && user?.id !== post.authorId) {
                    setPosts((prev) => {
                      const newPosts = prev
                        ? prev.filter((p) => p.id !== post.id)
                        : prev;
                      sessionStorage.setItem("posts", JSON.stringify(newPosts));
                      return newPosts;
                    });
                  }
                })
                .catch((err) => {
                  if (err.response.status === 409) {
                    alert(err.response.data);
                  } else {
                    alert("Error reporting post");
                  }
                });
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              fill="#eb4034"
              className="w-10"
            >
              <path d="M144 88C144 74.7 133.3 64 120 64C106.7 64 96 74.7 96 88L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 452L224.3 431.9C265.4 421.6 308.9 426.4 346.8 445.3C391 467.4 442.3 470.1 488.5 452.7L523.2 439.7C535.7 435 544 423.1 544 409.7L544 130C544 107 519.8 92 499.2 102.3L489.6 107.1C443.3 130.3 388.8 130.3 342.5 107.1C307.4 89.5 267.1 85.1 229 94.6L144 116L144 88zM144 165.5L240.6 141.3C267.6 134.6 296.1 137.7 321 150.1C375.9 177.5 439.7 179.8 496 156.9L496 398.7L471.6 407.8C437.9 420.4 400.4 418.5 368.2 402.4C320 378.3 264.9 372.3 212.6 385.3L144 402.5L144 165.5z" />
            </svg>
          </div>
        )}
      </div>
      {post.title && (
        <h2 className="font-semibold text-[1.5rem]">{post.title}</h2>
      )}
      <p className="font-medium text-(--secondary-text) w-full">
        {post.content}
      </p>
      <div className="flex gap-2 items-center text-(--brand) p-2 border-(--brand) rounded-lg">
        <img src="/customSvgs/book.svg" alt="Book" className="w-6" />
        <p className="text-[1rem]">{post.subject.toLocaleLowerCase()}</p>
      </div>
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
                  .then(() => {})
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
                  .then(() => {})
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
      {post.authorId == user?.id || user?.admin ? (
        <button
          className="bg-(--brand) px-4 py-1 rounded-md text-background border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200 disabled:bg-red-300 disabled:border-red-300 disabled:text-white"
          onClick={(e) => {
            e.stopPropagation();
            setDeleteDisabled(true);
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
                setUser({
                  ...user,
                  requests: user.requests.filter((p) => p.id !== post.id),
                });
              })
              .catch((err) => {
                console.log(err);
                alert("Error deleting post");
              })
              .finally(() => setDeleteDisabled(false));
          }}
          disabled={deleteDisabled}
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
