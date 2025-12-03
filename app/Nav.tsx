import Link from "next/link";
import Cap from "./icons/graduation-cap";

export default function Nav() {
  return (
    <nav className="flex items-center gap-2 justify-between px-4  fixed w-screen bg-background ">
      <div className="flex items-center gap-1">
        <Cap className="w-15 max-[900px]:w-10 fill-(--brand)" />
        <h1 className="text-[1.5rem] max-[900px]:text-[1.2rem] font-bold">
          BacNotes
        </h1>
      </div>
      <div className="flex justify-end gap-6 items-center w-1/2">
        <div className="relative group">
          <Link href={"/home"}>Home</Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full group-active:w-full transition-all duration-200 rounded-md"></span>
        </div>
        <div className="relative group">
          <Link href={"/add"}>Add</Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full group-active:w-full transition-all duration-200 rounded-md"></span>
        </div>
        <div className="relative group">
          <Link href={"/profile"}>Profile</Link>
          <span className="w-0 h-0.5 absolute bottom-0 left-0 bg-foreground group-hover:w-full group-active:w-full transition-all duration-200 rounded-md"></span>
        </div>
      </div>
    </nav>
  );
}
