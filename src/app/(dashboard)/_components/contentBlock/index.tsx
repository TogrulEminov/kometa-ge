"use client";
import { cn } from "@/utils/cn";
import React from "react";
const FieldBlock = ({
  title,
  children,
  className,
  wrapperClassName,
}: Readonly<{
  children: React.ReactNode;
  title?: string;
  className?: string;
  wrapperClassName?: string;
}>) => {
  return (
    <div
      className={cn(
        "p-5 rounded-[20px]  bg-[#f5f5f5] border border-[#ddd] ease-in-out flex flex-col space-y-6",
        className,
      )}
    >
      {title && <h3 className="text-base text-black font-medium">{title}</h3>}
      <div className={cn(wrapperClassName, "space-y-5")}> {children} </div>
    </div>
  );
};
export default FieldBlock;
