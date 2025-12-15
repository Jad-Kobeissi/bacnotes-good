import { useRouter } from "next/navigation";
import { TPost } from "./types";
import moment from "moment";

export default function Post({ post }: { post: TPost }) {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/post/${post.id}`)}
      key={post.id as string}
      className="border border-gray-300 flex flex-col gap-2 items-center justify-center rounded-lg p-20 w-full"
    >
      <h1 className="text-[1rem] font-medium">
        Username: {post.author.username}
      </h1>
      {post.title && (
        <h2 className="font-semibold text-[1.5rem]">{post.title}</h2>
      )}
      <p className="font-medium text-(--secondary-text)">{post.content}</p>
      <div className="flex max-[600px]:w-[120%] max-[400px]:w-[200%] w-1/2 overflow-x-auto snap-x snap-mandatory gap-4">
        {post.imagesUrl.map((image, key) => (
          <img src={image as string} key={key} className="snap-center " />
        ))}
      </div>
      <h1 className="text-(--secondary-text)">
        {moment(post.createdAt).fromNow()}
      </h1>
    </div>
  );
}
