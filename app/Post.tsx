import { useRouter } from "next/navigation";
import { TPost } from "./types";

export default function Post({ post }: { post: TPost }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/post/${post.id}`)}
      key={post.id as string}
      className="border border-gray-300 rounded-lg p-20"
    >
      <h1 className="text-[1.5rem]">{post.author.username}</h1>
      <h2 className="font-semibold">{post.title}</h2>
      <p className="font-medium text-(--secondary-text)">{post.content}</p>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory mt-4 w-3/4 max-[700px]:w-full">
        {post.imagesUrl.map((image, index) => (
          <img
            key={index}
            src={image as string}
            alt={post.title as string}
            className="snap-center"
            onClick={(e) => {
              e.stopPropagation();
              window.open(image as string, "_blank");
            }}
          />
        ))}
      </div>
    </div>
  );
}
