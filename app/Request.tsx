import { useRouter } from "next/navigation";
import { TRequest, TUser } from "./types";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";
import { useUser } from "./contexts/UserContext";
import axios from "axios";
import { getCookie } from "cookies-next";

export default function Request({
  request,
  setRequests,
}: {
  request: TRequest;
  setRequests?: Dispatch<SetStateAction<TRequest[]>>;
}) {
  const router = useRouter();
  const { user, setUser } = useUser();
  return (
    <div
      className="border border-gray-300 flex flex-col gap-2 items-start justify-center rounded-lg p-20 max-[380px]:p-5 w-full"
      onClick={(e) => {
        router.push(`/request/${request.id}`);
      }}
    >
      <div className="w-full">
        <div className="flex justify-between items-center gap-4">
          <div className="flex gap-2">
            <h1>Username: {request.author.username}</h1>
            {request.author.admin && (
              <h1 className="text-(--secondary-text)">admin</h1>
            )}
          </div>
          {request.authorId !== user?.id && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                axios
                  .post(
                    `/api/request/report/${request.id}`,
                    {},
                    {
                      headers: {
                        Authorization: `Bearer ${getCookie("token")}`,
                      },
                    }
                  )
                  .then((res) => {
                    alert("Request reported successfully");

                    if (setRequests && user?.id !== request.authorId) {
                      setRequests((prev) => {
                        const newRequests = prev
                          ? prev.filter((r) => r.id !== request.id)
                          : prev;
                        sessionStorage.setItem(
                          "requests",
                          JSON.stringify(newRequests)
                        );
                        return newRequests;
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
        <h1>{request.title}</h1>
        <p className="text-(--secondary-text)">{request.content}</p>
        <div className="flex gap-2 items-center text-(--brand) p-2 border-(--brand) rounded-lg">
          <img src="/customSvgs/book.svg" alt="Book" className="w-6" />
          <p className="text-[1rem]">{request.subject.toLocaleLowerCase()}</p>
        </div>
      </div>
      {user && user.id == request.authorId && (
        <button
          className="bg-(--brand) px-4 py-1 rounded-md text-background border
                      border-(--brand) hover:bg-transparent active:bg-transparent
                      hover:text-(--brand) active:text-(--brand) transition-all
                      duration-200"
          onClick={(e) => {
            e.stopPropagation();
            axios
              .delete(`/api/request/${request.id}`, {
                headers: {
                  Authorization: `Bearer ${getCookie("token")}`,
                },
              })
              .then((res) => {
                alert("Request deleted");
                setRequests &&
                  setRequests((prev) =>
                    prev.filter((r) => r.id !== request.id)
                  );
              })
              .catch((err) => {
                console.log(err);
                alert("Error deleting request");
              });
          }}
        >
          Delete
        </button>
      )}
      <h1 className="text-(--secondary-text)">
        {request.replies.length} replies
      </h1>
      <h1 className="text-(--secondary-text) mt-3">
        {moment(request.createdAt).fromNow()}
      </h1>
    </div>
  );
}
