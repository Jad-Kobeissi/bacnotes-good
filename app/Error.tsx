import React from "react";

export default function Error({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h1 className={`${className} text-red-500 text-[1.2rem]`}>{children}</h1>
  );
}
