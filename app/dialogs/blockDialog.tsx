import axios from "axios";
import { RefObject, useRef, useState } from "react";
import { TPost, TUser } from "../types";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";

export default function BlockDialog({
  dialogRef,
  userToBlock,
}: {
  dialogRef: RefObject<HTMLDialogElement>;
  userToBlock: TUser;
}) {
  const router = useRouter();
  return (
    <>
      <dialog
        ref={dialogRef}
        onClose={() => {}}
        className="bg-transparent overflow-hidden"
      >
        <div className="flex items-center justify-center flex-col gap-4 p-6 w-screen h-screen backdrop-blur-sm">
          <div className="flex flex-col gap-3 bg-white rounded-lg p-10">
            <h1 className="text-[1.4rem] font-medium">
              Are you sure you want to block this user?
            </h1>
            <div className="flex gap-2 items-center justify-center">
              <button
                className="bg-(--brand) text-white px-6 py-1 rounded-md border border-(--brand) hover:text-(--brand) hover:bg-transparent"
                onClick={() => {
                  axios
                    .post(
                      `/api/user/block/${userToBlock.id}`,
                      {},
                      {
                        headers: {
                          Authorization: `Bearer ${getCookie("token")}`,
                        },
                      }
                    )
                    .then(() => {
                      alert("User blocked");
                      const posts = JSON.parse(
                        sessionStorage.getItem("posts") || "[]"
                      );

                      const newPosts = posts.filter(
                        (p: TPost) => p.authorId !== userToBlock.id
                      );
                      sessionStorage.setItem("posts", JSON.stringify(newPosts));

                      window.location.reload();
                    })
                    .catch((err) => {
                      alert("Error blocking user: " + err.response.data);
                    });
                }}
              >
                Block
              </button>
              <button
                onClick={() => {
                  dialogRef.current?.close();
                }}
                className="bg-(--blue) text-white px-6 py-1 rounded-md border border-(--blue) hover:text-(--blue) hover:bg-transparent"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
