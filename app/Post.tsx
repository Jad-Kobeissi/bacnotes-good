import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { TPost } from "./types";
import moment from "moment";

export default function Post({ post }: { post: TPost }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/post/${post.id}`)}
      key={post.id as string}
      className="border border-gray-300 flex flex-col gap-2 items-start justify-center rounded-lg p-20 max-[380px]:p-5 w-full"
    >
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
