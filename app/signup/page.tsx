"use client";
import Link from "next/link";
import Cap from "../icons/graduation-cap";
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setCookie } from "cookies-next";
import axios from "axios";
import Error from "../Error";

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState(6)
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const { setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (password != confirmPass) setError("Passwords Don't match");
    else setError("");
  }, [password, confirmPass]);
  return (
    <>
      <div className="flex gap-4 justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setError("");
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              setError("Invalid Email");
              return;
            }
            if (password != confirmPass) {
              setError("Passwords Don't match");
              return;
            }

            axios
              .post("/api/signup", {
                username,
                email,
                password,
                grade
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
          className="flex items-center justify-center flex-col mt-[30vh]"
        >
          <div className="flex items-center gap-4">
            <div className="bg-(--brand) w-fit h-fit p-2 rounded-md">
              <Cap className="w-10 fill-white" />
            </div>
            <h1 className="text-[1.5rem] font-semibold">BacNotes</h1>
          </div>
          <div className="text-center">
            <h1 className="text-[2rem] font-semibold">Create Account</h1>
            <p className="text-(--secondary-text) text-[1.2rem]">
              Join your campus community today
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
              <label htmlFor="username" className="text-[1.2rem] font-bold">
                Username
              </label>
              <input
                type="text"
                placeholder="Dont use Your real name"
                id="username"
                className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="password" className="text-[1.2rem] font-bold">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a Strong Password"
                id="password"
                className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="confirmPass" className="text-[1.2rem] font-bold">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                id="confirmPass"
                className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="grade" className="text-[1.2rem] font-bold">
                Grade
              </label>
              <input
                type="number"
                placeholder="Enter your grade"
                id="grade"
                className="shadow-md px-4 py-1 text-[1.2rem] rounded-md outline-none"
                max={12}
                min={1}
                onChange={(e) => setGrade(parseInt(e.target.value))}
              />
            </div>
            <button className="w-full bg-(--brand) py-1 text-background rounded-lg font-medium">
              Create Account
            </button>
            <h1 className="text-(--secondary-text) font-semibold">
              Already Have An Account?{" "}
              <Link
                className="text-(--brand) font-semibold hover:underline active:underline"
                href={"/login"}
              >
                Sign In
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
