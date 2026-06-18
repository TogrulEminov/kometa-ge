"use client";
import { cn } from "@/utils/cn";
import React from "react";
const FieldBlock = ({
  title,
  children,
  className,
}: Readonly<{
  children: React.ReactNode;
  title?: string;
  className?: string;
}>) => {
  return (
    <div
      className={cn(
        "p-5 rounded-[20px] bg-[#f5f5f5] border border-[#ddd] ease-in-out flex flex-col space-y-6",
        className,
      )}
    >
      <h3 className="text-base text-black font-medium">{title}</h3>
      {children}
    </div>
  );
};
export default FieldBlock;
