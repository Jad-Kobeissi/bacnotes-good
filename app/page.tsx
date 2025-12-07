"use client";
import { motion } from "motion/react";
import Cap from "./icons/graduation-cap";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
function Nav() {
  const router = useRouter();
  return (
    <nav className="flex items-center gap-2 justify-between px-4  fixed w-screen bg-background">
      <div className="flex items-center gap-1">
        <Cap className="w-15 max-[900px]:w-10 fill-(--brand)" />
        <h1 className="text-[1.5rem] max-[900px]:text-[1.2rem] font-bold">
          BacNotes
        </h1>
      </div>
      <div className="flex items-center justify-center gap-2">
        <button
          className="px-5 py-1 font-semibold border border-[#e0e1e2] rounded-md hover:bg-[#e0e1e2c5] active:bg-[#e0e1e2c5] transition-all text-[1.2rem]"
          onClick={() => {
            router.push("/login");
          }}
        >
          SignIn
        </button>
        <button
          className="bg-(--brand) text-background px-5 py-1 rounded-md font-semibold transition-all hover:bg-transparent active:bg-transparent border border-(--brand) hover:text-(--brand) active:text-(--brand) text-[1.2rem] max-[510px]:text-[.6rem]"
          onClick={() => {
            router.push("/signup");
          }}
        >
          Get Started Now
        </button>
      </div>
    </nav>
  );
}
function Home() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  return (
    <div className="px-4 flex flex-col items-center pt-[20vh]">
      <motion.img
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3 }}
        src="/customSvgs/learning.svg"
        alt="Learning Svg"
        className="w-1/4 max-[900px]:w-3/4"
      />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 className="text-(--brand) font-semibold my-4">
          Your School's Social Hub
        </h3>
        <h1 className="text-[2rem] font-bold">
          Connect, Share, and Thrive in Your School Community
        </h1>
        <p className="text-(--secondary-text) text-[1.3rem]">
          Stay connected with classmates, discover campus events, and make the
          most of your school experience with CampusConnect.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href={"/signup"}
            className="px-5 py-2 bg-(--brand) text-background text-[1rem] font-semibold rounded-md transition-all hover:bg-transparent active:bg-transparent border border-(--brand) hover:text-(--brand) active:text-(--brand)"
          >
            Join Now
          </Link>
          <Link
            href={"#features"}
            className="border border-(--secondary-text) text-[1rem] px-5 py-2 rounded-md"
          >
            Learn More
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
function Features() {
  function Card({
    title,
    description,
    icon,
    index,
  }: {
    title: string;
    description: string;
    icon: string;
    index: number;
  }) {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.3,
    });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3, delay: index * 0.2 }}
        className="shadow-lg p-4"
      >
        <img src={icon} alt="dsfgdfg" className="w-15" />
        <h1 className="text-[2rem] font-semibold">{title}</h1>
        <p className="text-(--secondary-text) font-medium text-[1.3rem]">
          {description}
        </p>
      </motion.div>
    );
  }
  interface TCard {
    title: string;
    description: string;
    icon: string;
  }
  const cards: TCard[] = [
    {
      title: "Social Feed",
      description:
        "Share updates, photos, and achievements with your school community. Like, comment, and engage with posts from classmates.",
      icon: "/customSvgs/message.svg",
    },
    {
      title: "Organized Study Notes",
      description:
        "Access clear, well-structured notes for every subject and chapter. Study smarter with simplified explanations made for students.",
      icon: "/customSvgs/clipboard.svg",
    },
    {
      title: "Smart Search for Subjects",
      description:
        "Quickly find notes, chapters, and resources using a fast, easy-to-use search experience tailored for students.",
      icon: "/customSvgs/magnifying-glass.svg",
    },
    {
      title: "Downloadable Materials",
      description:
        "Download notes, PDFs, and resources for offline studying anytime.",
      icon: "/customSvgs/download.svg",
    },
    {
      title: "Exam-Focused Content",
      description:
        "Study only what matters. BacNotes materials are built around school curricula and exam requirements.",
      icon: "/customSvgs/cap.svg",
    },
    {
      title: "Subject-Based Navigation",
      description:
        "Browse subjects effortlessly with a clean layout that helps you jump directly to the material you need.",
      icon: "/customSvgs/book.svg",
    },
  ];
  return (
    <div
      className="flex items-center justify-center flex-col gap-3 py-[20vh]"
      id="features"
    >
      <div className="text-center">
        <h1 className="text-[3rem] font-bold">
          Everything You Need to Stay Connected
        </h1>
        <p className="font-semibold text-(--secondary-text) text-[1.5rem]">
          Powerful features designed specifically for student life and campus
          engagement.
        </p>
      </div>
      <div className="gridCustom place-items-center gap-16">
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
function HowItWorks() {
  function Card({
    title,
    description,
    icon,
    index,
  }: {
    title: string;
    description: string;
    icon: string;
    index: number;
  }) {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.3,
    });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.3, delay: index * 0.2 }}
        className="w-1/3 flex items-center flex-col relative max-[900px]:w-full gap-4"
      >
        <div className="absolute bg-(--brand) top-0 right-0 rounded-full text-background p-4 w-8 h-8 font-bold flex items-center justify-center">
          {index + 1}
        </div>
        <div className="bg-(--brand) w-fit h-fit p-8 rounded-full">
          <img src={icon} alt="User" className="w-20" />
        </div>
        <div className="text-center w-3/4">
          <h1 className="text-[1.2rem] font-semibold">{title}</h1>
          <p className="text-(--secondary-text)">{description}</p>
        </div>
      </motion.div>
    );
  }
  interface TCard {
    title: string;
    description: string;
    icon: string;
  }
  const cards: TCard[] = [
    {
      title: "Create Your Profile",
      description:
        "Sign up with your email, add your major, interests, and a profile photo to help classmates find you.",
      icon: "/customSvgs/user.svg",
    },
    {
      title: "Connect with Classmates",
      description:
        "Find and follow friends, join student groups, and discover people in your classes or with similar interests.",
      icon: "/customSvgs/double-user.svg",
    },
    {
      title: "Engage & Share",
      description:
        "Post updates, share campus events, join discussions, and stay connected with everything happening at school.",
      icon: "/customSvgs/heart.svg",
    },
  ];
  return (
    <div className="flex flex-col gap-8 mb-8">
      <div className="flex items-center flex-col">
        <h1 className="text-[3rem] font-semibold">How It Works</h1>
        <p className="text-(--secondary-text) text-[1.5rem] font-medium">
          Get started in just three simple steps
        </p>
      </div>
      <div className="flex max-[900px]:flex-col items-center gap-16">
        {cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            icon={card.icon}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
function Footer() {
  const router = useRouter();
  return (
    <div className="bg-(--brand) text-background py-20 flex flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-[3rem] font-semibold">
        Ready to Join The Community?
      </h1>
      <p className="text-[1.5rem]">
        Join the students already using Bacnotes to enhance their school
        experience.
      </p>
      <button
        className="bg-background text-(--brand) px-4 py-2 rounded-md text-[1.3rem] font-semibold border border-background hover:bg-transparent active:bg-transparent hover:text-background active:text-background transition-all"
        onClick={() => {
          router.push("/signup");
        }}
      >
        Get Started Now
      </button>
    </div>
  );
}
export default function Page() {
  return (
    <>
      <Nav />
      <Home />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}
