"use client";
import React from "react";
import { Pagination } from "antd";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

interface GlobalPaginationProps {
  total: number;
}

const GlobalPagination: React.FC<GlobalPaginationProps> = ({ total }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 12);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const onChange = (page: number, newPageSize: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}` as any);
  };

  return (
    <Pagination
      current={currentPage}
      pageSize={pageSize}
      total={total}
      onChange={onChange}
    />
  );
};

export default GlobalPagination;
