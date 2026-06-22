"use client";
import React from "react";
import dynamic from "next/dynamic";
const GlobalPagination = dynamic(
  () => import("@/globalElement/custom-pagination"),
  {
    ssr: false,
  },
);
import { PaginationItem } from "@/services/interface/type";
import { cn } from "@/utils/cn";
interface Props {
  paginations: PaginationItem;
  className?: string;
}
export default function PaginationContainer({ paginations, className }: Props) {
  if (paginations?.page <= paginations?.totalPages) return null;
  return (
    <div className={cn("py-10 flex items-center justify-center", className)}>
      <GlobalPagination total={paginations?.totalPages} />
    </div>
  );
}
