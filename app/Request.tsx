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
      <div>
        <h1>Username: {request.author.username}</h1>
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
