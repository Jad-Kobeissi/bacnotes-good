"use client";
import Link from "next/link";
import Cap from "../icons/graduation-cap";
import Loading from "../Loading";
import { useState } from "react";
import axios from "axios";
import { useUser } from "../contexts/UserContext";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Error from "../Error";

export default function LogIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const router = useRouter();
  return loading ? (
    <Loading className="flex items-center justify-center h-screen" />
  ) : (
    <>
      <div className="flex gap-4 justify-center">
        {loading && <Loading />}
        <form
          className="flex items-center justify-center flex-col mt-[30vh]"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            axios
              .post("/api/login", {
                email,
                password,
              })
              .then((res) => {
                setUser(res.data.user);
                setCookie("token", res.data.token);
                router.push("/home");
              })
              .catch((err) => {
                setError(err.response.data);
                setLoading(false);
              });
          }}
        >
          <div className="flex items-center gap-4">
            <div className="bg-(--brand) w-fit h-fit p-2 rounded-md">
              <Cap className="w-10 fill-white" />
            </div>
            <h1 className="text-[1.5rem] font-semibold">BacNotes</h1>
          </div>
          <div className="text-center">
            <h1 className="text-[2rem] font-semibold">Welcome Back</h1>
            <p className="text-(--secondary-text) text-[1.2rem]">
              Sign in to continue to your account
            </p>
          </div>
          <div className="shadow-xl p-16 flex flex-col gap-4">
            {error && <Error>{error}</Error>}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-[1.2rem] font-bold">
                Email
              </label>
              <input
                type="text"
                placeholder="john@doe.com"
                id="email"
                className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-[1.2rem] font-bold">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                id="password"
                className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="w-full bg-(--brand) py-1 text-background rounded-lg font-medium">
              LogIn
            </button>
            <h1 className="text-(--secondary-text) font-semibold">
              Dont Have An Account?{" "}
              <Link
                className="text-(--brand) font-semibold hover:underline active:underline"
                href={"/signup"}
              >
                Sign Up
              </Link>
            </h1>
            <div className="w-full h-[0.1rem] bg-[#6c6c6c]" />
            <Link
              href={"/"}
              className="flex gap-1 font-bold items-center text-(--secondary-text) justify-center"
            >
              <img
                src="/customSvgs/left-arrow.svg"
                alt="Left Arrow"
                className="w-6"
              />
              Back To Home
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
