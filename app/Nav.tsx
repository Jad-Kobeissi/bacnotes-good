"use client";
import Link from "next/link";
import Cap from "./icons/graduation-cap";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next";

export default function Nav() {
  const router = useRouter();
  return (
    <nav className="flex items-center gap-2 max-[470px]:gap-1 justify-between min-[470px]:px-4  fixed w-screen bg-background">
      <div className="flex items-center gap-1">
        <Cap className="w-15 max-[900px]:w-10 fill-(--brand)" />
        <h1 className="text-[1.5rem] max-[900px]:text-[1.2rem] font-bold">
          BacNotes
        </h1>
      </div>
      <div className="flex justify-end gap-6 items-center max-[470px]:text-[.89rem] max-[470px]:gap-2 mr-3">
        <div className="relative group">
          <Link href={"/home"}>Home</Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full group-active:w-full transition-all duration-200 rounded-md"></span>
        </div>
        <div className="relative group">
          <Link href={"/search"}>Search</Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full group-active:w-full transition-all duration-200 rounded-md"></span>
        </div>
        <div className="relative group">
          <Link href={"/profile"}>Profile</Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full group-active:w-full transition-all duration-200 rounded-md"></span>
        </div>
        <div
          className="relative group cursor-pointer"
          onClick={() => {
            localStorage.clear();
            sessionStorage.clear();
            deleteCookie("token");
            router.push("/");
          }}
        >
          <h1>LogOut</h1>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full group-active:w-full transition-all duration-200 rounded-md"></span>
        </div>
      </div>
    </nav>
  );
}
