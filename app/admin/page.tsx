"use client";
import { useRouter } from "next/navigation";
import Nav from "../Nav";

export default function AdminPage() {
  const router = useRouter();
  return (
    <>
      <Nav />
      <div className="pt-[30vh] flex flex-col gap-2 ">
        <h1 className="text-[1.3rem] font-semibold text-center">Admin Page</h1>
        <div className="pt-5 flex gap-4 items-center justify-center">
          <button
            onClick={() => router.push("/admin/postReports")}
            className="bg-(--brand) px-4 py-1 rounded-md text-background text-[1.2rem]"
          >
            Post Reports
          </button>
          <button
            onClick={() => router.push("/admin/requestReports")}
            className="bg-(--brand) px-4 py-1 rounded-md text-background text-[1.2rem]"
          >
            Request Reports
          </button>
        </div>
      </div>
    </>
  );
}
