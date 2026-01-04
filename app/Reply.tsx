import moment from "moment";
import { TReply } from "./types";
import axios from "axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { useUser } from "./contexts/UserContext";
import { useRouter } from "next/navigation";

export default function Reply({
  reply,
  setReplies,
}: {
  reply: TReply;
  setReplies?: React.Dispatch<React.SetStateAction<TReply[]>>;
}) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    if (!user) return;
    if (!reply) return;

    setLiked(reply.likedUsers.some((u) => u.id == user.id));
    setLikes(reply.likes as number);
  }, [user]);
  const router = useRouter();
  return (
    <div
      key={reply.id as string}
      className="w-1/2 max-[550px]:w-3/4 max-[550px]:mx-4 flex flex-col border border-gray-300 p-3 text-center gap-3 rounded-md"
      onClick={() => {
        router.push(`/reply/${reply.id}`);
      }}
    >
      <div className="flex items-center justify-between">
        <h1 className="mb-4">{reply.author.username}</h1>
        {reply.authorId == user?.id && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              axios
                .post(
                  `/api/reply/report/${reply.id}`,
                  {},
                  {
                    headers: {
                      Authorization: `Bearer ${getCookie("token")}`,
                    },
                  }
                )
                .then((res) => {
                  alert("Request reported successfully");

                  if (setReplies && user?.id !== reply.authorId) {
                    setReplies((prev) => {
                      const newReplies = prev
                        ? prev.filter((r) => r.id !== reply.id)
                        : prev;
                      sessionStorage.setItem(
                        "replies",
                        JSON.stringify(newReplies)
                      );
                      return newReplies;
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
      <h1 className="text-[1rem]">{reply.content}</h1>
      <div className="w-full flex justify-center">
        <div className="flex max-[600px]:w-[120%] max-[400px]:w-[200%] w-1/2 overflow-x-auto snap-x snap-mandatory gap-4 items-center">
          {reply.imageUrls.map((image, key) => (
            <img
              src={image as string}
              key={key}
              className="snap-center rounded-md"
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center gap-2">
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
                  `/api/reply/dislike/${reply.id}`,
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
                  `/api/reply/like/${reply.id}`,
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
      {user?.id == reply.authorId && (
        <div className="flex flex-col mx-2 gap-2">
          <button
            className="bg-(--blue) text-background px-4 py-1 rounded-md border border-(--blue) hover:bg-transparent active:bg-transparent hover:text-(--blue) active:text-(--blue) transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/reply/edit/${reply.id}`);
            }}
          >
            Edit
          </button>
          <button
            className="bg-(--brand) text-background px-4 py-1 rounded-md border border-(--brand) hover:bg-transparent active:bg-transparent hover:text-(--brand) active:text-(--brand) transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation();
              axios
                .delete(`/api/reply/${reply.id}`, {
                  headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                  },
                })
                .then((res) => {
                  alert("Reply Deleted");
                  setReplies &&
                    setReplies((prev) => prev.filter((r) => r.id !== reply.id));
                })
                .catch((err) => {
                  console.log(err);
                  alert("Error deleting Reply");
                });
            }}
          >
            Delete
          </button>
        </div>
      )}
      <h1>{moment(reply.createdAt).fromNow()}</h1>
    </div>
  );
}
